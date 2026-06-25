import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listHistory, deleteHistoryItem } from "../api/history";

function formatDate(value) {
    if (!value) return "";
    try {
        return new Date(value).toLocaleString(undefined, {
            month: "short", day: "numeric",
            hour: "numeric", minute: "2-digit"
        });
    } catch {
        return "";
    }
}

function verdictTone(score) {
    if (score >= 70) return "good";
    if (score >= 40) return "warn";
    return "bad";
}

function TrashIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function HistoryPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        let active = true;

        async function load() {
            try {
                const data = await listHistory();
                if (active) setItems(data);
            } catch {
                if (active) setError("Couldn't load analysis history.");
            } finally {
                if (active) setLoading(false);
            }
        }

        load();
        return () => { active = false; };
    }, []);

    const handleDelete = async (id) => {
        setDeleting(id);
        try {
            await deleteHistoryItem(id);
            setItems((prev) => prev.filter((i) => i.id !== id));
        } catch {
            // keep the row visible if delete fails
        } finally {
            setDeleting(null);
            setConfirmDeleteId(null);
        }
    };

    return (
        <div className="panel">
            <p className="panel-eyebrow">History</p>
            <h2 className="panel-title">Past analyses</h2>
            <p className="panel-sub">Every readout you've run, most recent first.</p>

            {loading && (
                <p className="loading-row" style={{ justifyContent: "flex-start" }}>
                    <span className="spinner" style={{ color: "#14181f" }} />
                    Loading…
                </p>
            )}

            {!loading && error && <p className="message message-error">{error}</p>}

            {!loading && !error && items.length === 0 && (
                <div className="empty-state">
                    <p>No analyses yet — run one from New analysis.</p>
                </div>
            )}

            {!loading && items.length > 0 && (
                <ul className="history-list">
                    {items.map((item) => (
                        <li key={item.id}>
                            {confirmDeleteId === item.id ? (
                                <div className="history-confirm">
                                    <span className="history-confirm-label">Delete this analysis?</span>
                                    <button type="button" className="picker-confirm-yes"
                                        disabled={deleting === item.id}
                                        onClick={() => handleDelete(item.id)}>
                                        {deleting === item.id
                                            ? <span className="spinner" style={{ color: "#b8513f" }} />
                                            : null}
                                        Yes, delete
                                    </button>
                                    <button type="button" className="picker-confirm-no"
                                        onClick={() => setConfirmDeleteId(null)}>
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="history-row-wrap">
                                    <Link className="history-row" to={`/history/${item.id}`}>
                                        <span className={`history-score history-${verdictTone(item.match_score)}`}>
                                            {item.match_score}%
                                        </span>
                                        <span className="history-meta">
                                            <span className="history-title">
                                                {item.job_title || "Untitled role"}
                                                {item.job_company ? ` @ ${item.job_company}` : ""}
                                            </span>
                                            <span className="history-sub">
                                                {item.resume_name || item.resume_file_name || "Resume"}
                                                {" · "}
                                                {formatDate(item.created_at)}
                                            </span>
                                        </span>
                                    </Link>
                                    <button type="button" className="history-delete"
                                        aria-label="Delete analysis"
                                        onClick={() => setConfirmDeleteId(item.id)}>
                                        <TrashIcon />
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default HistoryPage;
