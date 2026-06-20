import { useEffect, useState } from "react";
import { createJob, listJobs, deleteJob } from "../api/job";

const MAX_DESCRIPTION = 6000;

function formatDate(value) {
    if (!value) return "";
    try {
        return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
        return "";
    }
}

function TrashIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function JDForm({ onCreated }) {
    const [mode, setMode] = useState("new");

    const [formData, setFormData] = useState({ title: "", company: "", description: "" });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    const [existing, setExisting] = useState([]);
    const [existingLoading, setExistingLoading] = useState(false);
    const [existingError, setExistingError] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [loadedExisting, setLoadedExisting] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        if (mode !== "existing" || loadedExisting) return;

        let active = true;

        async function load() {
            setExistingLoading(true);
            try {
                const data = await listJobs();
                if (active) setExisting(data);
            } catch {
                if (active) setExistingError("Couldn't load saved roles.");
            } finally {
                if (active) {
                    setExistingLoading(false);
                    setLoadedExisting(true);
                }
            }
        }

        load();
        return () => { active = false; };
    }, [mode, loadedExisting]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setSaveError("");
            const response = await createJob(formData);
            const jobId = response.job_id || response.id;
            if (!jobId) {
                setSaveError("Saved, but the server didn't send back a job ID.");
                return;
            }
            onCreated({ id: jobId, title: formData.title, company: formData.company });
        } catch (err) {
            setSaveError(err?.response?.data?.detail || "Failed to save the job description.");
        } finally {
            setSaving(false);
        }
    };

    const handleUseExisting = () => {
        const job = existing.find((item) => item.id === selectedId);
        if (!job) return;
        onCreated({ id: job.id, title: job.title, company: job.company });
    };

    const handleDelete = async (id) => {
        setDeleting(id);
        try {
            await deleteJob(id);
            setExisting((prev) => prev.filter((j) => j.id !== id));
            if (selectedId === id) setSelectedId(null);
        } catch {
            // keep the row if delete fails
        } finally {
            setDeleting(null);
            setConfirmDeleteId(null);
        }
    };

    return (
        <div className="panel">
            <p className="panel-eyebrow">Step 02</p>
            <h2 className="panel-title">Add the role</h2>
            <p className="panel-sub">Paste a new posting, or reuse a role you've already saved.</p>

            <div className="tab-row">
                <button type="button"
                    className={"tab-button" + (mode === "new" ? " is-active" : "")}
                    onClick={() => setMode("new")}>
                    New job
                </button>
                <button type="button"
                    className={"tab-button" + (mode === "existing" ? " is-active" : "")}
                    onClick={() => setMode("existing")}>
                    Choose existing
                </button>
            </div>

            {mode === "new" && (
                <>
                    <form onSubmit={handleSubmit}>
                        <div className="field-row">
                            <div className="field">
                                <label className="field-label" htmlFor="title">Job title</label>
                                <input id="title" className="text-input" type="text" name="title"
                                    value={formData.title} onChange={handleChange}
                                    placeholder="Backend Engineer" required />
                            </div>
                            <div className="field">
                                <label className="field-label" htmlFor="company">Company</label>
                                <input id="company" className="text-input" type="text" name="company"
                                    value={formData.company} onChange={handleChange}
                                    placeholder="Acme Inc" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="field-label" htmlFor="description">Job description</label>
                            <textarea id="description" className="text-area" name="description"
                                value={formData.description} onChange={handleChange}
                                maxLength={MAX_DESCRIPTION} placeholder="Paste the full posting here..." required />
                            <div className="field-hint">
                                <span>Required and preferred skills both help</span>
                                <span>{formData.description.length}/{MAX_DESCRIPTION}</span>
                            </div>
                        </div>
                        <div className="btn-row">
                            <button className="btn" type="submit" disabled={saving}>
                                {saving && <span className="spinner" />}
                                {saving ? "Saving" : "Save and continue"}
                            </button>
                        </div>
                    </form>
                    {saveError && <p className="message message-error">{saveError}</p>}
                </>
            )}

            {mode === "existing" && (
                <>
                    {existingLoading && (
                        <p className="loading-row" style={{ justifyContent: "flex-start", padding: "10px 0" }}>
                            <span className="spinner" style={{ color: "#14181f" }} />
                            Loading saved roles…
                        </p>
                    )}
                    {!existingLoading && existingError && <p className="message message-error">{existingError}</p>}
                    {!existingLoading && !existingError && existing.length === 0 && (
                        <div className="empty-state">
                            <p>No saved roles yet — switch to "New job" to add one.</p>
                        </div>
                    )}
                    {!existingLoading && existing.length > 0 && (
                        <ul className="picker-list">
                            {existing.map((item) => (
                                <li key={item.id}>
                                    {confirmDeleteId === item.id ? (
                                        <div className="picker-confirm">
                                            <span className="picker-confirm-label">Delete this role? </span>
                                            <button type="button" className="picker-confirm-yes"
                                                disabled={deleting === item.id}
                                                onClick={() => handleDelete(item.id)}>
                                                {deleting === item.id ? <span className="spinner" style={{ color: "#b8513f" }} /> : null}
                                                Yes, delete
                                            </button>
                                            <button type="button" className="picker-confirm-no"
                                                onClick={() => setConfirmDeleteId(null)}>
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={"picker-row" + (selectedId === item.id ? " is-selected" : "")}>
                                            <button type="button" className="picker-row-select"
                                                onClick={() => setSelectedId(item.id)}>
                                                <span className="picker-radio" />
                                                <span className="picker-meta">
                                                    <span className="picker-title">
                                                        {item.title}{item.company ? ` @ ${item.company}` : ""}
                                                    </span>
                                                    <span className="picker-sub">
                                                        {item.created_at ? formatDate(item.created_at) : ""}
                                                    </span>
                                                </span>
                                            </button>
                                            <button type="button" className="picker-delete"
                                                aria-label="Delete role"
                                                onClick={() => setConfirmDeleteId(item.id)}>
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="btn-row" style={{ marginTop: 20 }}>
                        <button className="btn" onClick={handleUseExisting} disabled={!selectedId}>
                            Use this role
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default JDForm;
