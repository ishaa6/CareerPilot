import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listHistory } from "../api/history";

function formatDate(value) {
    if (!value) return "";
    try {
        return new Date(value).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
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

function HistoryPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        listHistory()
            .then(setItems)
            .catch(() => setError("Couldn't load analysis history."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="panel">
            <p className="panel-eyebrow">History</p>
            <h2 className="panel-title">Past analyses</h2>

            {loading && (
                <p className="loading-row" style={{ justifyContent: "flex-start" }}>
                    <span className="spinner" style={{ color: "#14181f" }} />
                    Loading…
                </p>
            )}

            {!loading && error && <p className="message message-error">{error}</p>}

            {!loading && !error && items.length === 0 && (
                <div className="empty-state">
                    <p>No analysis yet</p>
                </div>
            )}

            {!loading && items.length > 0 && (
                <ul className="history-list">
                    {items.map((item) => (
                        <li key={item.id}>
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default HistoryPage;