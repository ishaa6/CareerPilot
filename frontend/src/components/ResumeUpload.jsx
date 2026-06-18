import { useEffect, useRef, useState } from "react";
import { uploadResume, listResumes } from "../api/resume";

function formatDate(value) {
    if (!value) return "";
    try {
        return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
        return "";
    }
}

function ResumeUpload({ onUploaded }) {
    const [mode, setMode] = useState("upload");

    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const inputRef = useRef(null);

    const [existing, setExisting] = useState([]);
    const [existingLoading, setExistingLoading] = useState(false);
    const [existingError, setExistingError] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [loadedExisting, setLoadedExisting] = useState(false);

    useEffect(() => {
        if (mode !== "existing" || loadedExisting) return;

        let active = true;

        async function load() {
            setExistingLoading(true);

            try {
                const data = await listResumes();
                if (active) setExisting(data);
            } catch {
                if (active) setExistingError("Couldn't load saved resumes.");
            } finally {
                if (active) {
                    setExistingLoading(false);
                    setLoadedExisting(true);
                }
            }
        }

        load();

        return () => {
            active = false;
        };
    }, [mode, loadedExisting]);

    const pickFile = (candidate) => {
        if (!candidate) return;
        if (candidate.type !== "application/pdf") {
            setUploadError("Only PDF files are accepted.");
            return;
        }
        setUploadError("");
        setFile(candidate);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        pickFile(e.dataTransfer.files?.[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadError("Choose a resume PDF first.");
            return;
        }

        try {
            setUploading(true);
            setUploadError("");

            const data = await uploadResume(file);
            const resumeId = data.resume_id || data.id;

            if (!resumeId) {
                setUploadError(
                    "Uploaded, but the server didn't send back a resume ID, so the " +
                        "next step can't run yet."
                );
                return;
            }

            onUploaded({ id: resumeId, fileName: data.file_name || file.name });
        } catch (err) {
            setUploadError(err?.response?.data?.detail || "Failed to upload resume.");
        } finally {
            setUploading(false);
        }
    };

    const handleUseExisting = () => {
        const resume = existing.find((item) => item.id === selectedId);
        if (!resume) return;

        onUploaded({ id: resume.id, fileName: resume.file_name || resume.name || "Saved resume" });
    };

    return (
        <div className="panel">
            <h2 className="panel-title">Add your resume</h2>

            <div className="tab-row">
                <button
                    type="button"
                    className={"tab-button" + (mode === "upload" ? " is-active" : "")}
                    onClick={() => setMode("upload")}
                >
                    Upload new
                </button>
                <button
                    type="button"
                    className={"tab-button" + (mode === "existing" ? " is-active" : "")}
                    onClick={() => setMode("existing")}
                >
                    Choose existing
                </button>
            </div>

            {mode === "upload" && (
                <>
                    <div
                        className={
                            "dropzone" +
                            (dragActive ? " is-active" : "") +
                            (file ? " has-file" : "")
                        }
                        onClick={() => !file && inputRef.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragActive(true);
                        }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                    >
                        {file ? (
                            <span className="file-chip">
                                {file.name}
                                <button
                                    type="button"
                                    className="file-chip-remove"
                                    aria-label="Remove file"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                    }}
                                >
                                    ✕
                                </button>
                            </span>
                        ) : (
                            <>
                                <svg className="dropzone-icon" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 4v11m0 0-4-4m4 4 4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <p className="dropzone-title">Drop your resume here</p>
                                <p className="dropzone-hint">or click to browse</p>
                            </>
                        )}
                        <input
                            ref={inputRef}
                            type="file"
                            accept="application/pdf"
                            hidden
                            onChange={(e) => pickFile(e.target.files?.[0])}
                        />
                    </div>

                    <div className="btn-row" style={{ marginTop: 20 }}>
                        <button className="btn" onClick={handleUpload} disabled={uploading || !file}>
                            {uploading && <span className="spinner" />}
                            {uploading ? "Uploading" : "Upload and continue"}
                        </button>
                    </div>

                    {uploadError && <p className="message message-error">{uploadError}</p>}
                </>
            )}

            {mode === "existing" && (
                <>
                    {existingLoading && (
                        <p className="loading-row" style={{ justifyContent: "flex-start", padding: "10px 0" }}>
                            <span className="spinner" style={{ color: "#14181f" }} />
                            Loading saved resumes…
                        </p>
                    )}

                    {!existingLoading && existingError && (
                        <p className="message message-error">{existingError}</p>
                    )}

                    {!existingLoading && !existingError && existing.length === 0 && (
                        <div className="empty-state">
                            <p>No saved resumes yet — switch to "Upload new" to add one.</p>
                        </div>
                    )}

                    {!existingLoading && existing.length > 0 && (
                        <ul className="picker-list">
                            {existing.map((item) => (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        className={"picker-row" + (selectedId === item.id ? " is-selected" : "")}
                                        onClick={() => setSelectedId(item.id)}
                                    >
                                        <span className="picker-radio" />
                                        <span className="picker-meta">
                                            <span className="picker-title">
                                                {item.name || item.file_name || "Resume"}
                                            </span>
                                            <span className="picker-sub">
                                                {item.file_name}
                                                {item.created_at ? ` · ${formatDate(item.created_at)}` : ""}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="btn-row" style={{ marginTop: 20 }}>
                        <button className="btn" onClick={handleUseExisting} disabled={!selectedId}>
                            Use this resume
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ResumeUpload;