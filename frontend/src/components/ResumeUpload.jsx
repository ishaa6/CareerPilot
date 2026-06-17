import { useRef, useState } from "react";
import { uploadResume } from "../api/resume";

function ResumeUpload({ onUploaded }) {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    const pickFile = (candidate) => {
        if (!candidate) return;
        if (candidate.type !== "application/pdf") {
            setError("Only PDF files are accepted.");
            return;
        }
        setError("");
        setFile(candidate);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        pickFile(e.dataTransfer.files?.[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Choose a resume PDF first.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await uploadResume(file);
            const resumeId = data.resume_id || data.id;

            if (!resumeId) {
                setError(
                    "Uploaded, but the server didn't send back a resume ID, so the " +
                        "next step can't run yet."
                );
                return;
            }

            onUploaded({ id: resumeId, fileName: file.name });
        } catch (err) {
            setError(err?.response?.data?.detail || "Failed to upload resume.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel">
            <h2 className="panel-title">Upload your resume</h2>

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
                <button className="btn" onClick={handleUpload} disabled={loading || !file}>
                    {loading && <span className="spinner" />}
                    {loading ? "Uploading" : "Upload and continue"}
                </button>
            </div>

            {error && <p className="message message-error">{error}</p>}
        </div>
    );
}

export default ResumeUpload;
