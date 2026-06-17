import { useState } from "react";
import { createJob } from "../api/job";

const MAX_DESCRIPTION = 6000;

function JDForm({ onCreated }) {
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await createJob(formData);
            const jobId = response.job_id || response.id;

            if (!jobId) {
                setError(
                    "Saved, but the server didn't send back a job ID, so the next " +
                        "step can't run yet."
                );
                return;
            }

            onCreated({ id: jobId, title: formData.title, company: formData.company });
        } catch (err) {
            setError(err?.response?.data?.detail || "Failed to save the job description.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel">
            <h2 className="panel-title">Describe the role</h2>

            <form onSubmit={handleSubmit}>
                <div className="field-row">
                    <div className="field">
                        <label className="field-label" htmlFor="title">Job title</label>
                        <input
                            id="title"
                            className="text-input"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Backend Engineer"
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="company">Company</label>
                        <input
                            id="company"
                            className="text-input"
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Acme Inc"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="field-label" htmlFor="description">Job description</label>
                    <textarea
                        id="description"
                        className="text-area"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={MAX_DESCRIPTION}
                        placeholder="Paste the full posting here..."
                        required
                    />
                    <div className="field-hint">
                        <span>{formData.description.length}/{MAX_DESCRIPTION}</span>
                    </div>
                </div>

                <div className="btn-row">
                    <button className="btn" type="submit" disabled={loading}>
                        {loading && <span className="spinner" />}
                        {loading ? "Saving" : "Save and continue"}
                    </button>
                </div>
            </form>

            {error && <p className="message message-error">{error}</p>}
        </div>
    );
}

export default JDForm;
