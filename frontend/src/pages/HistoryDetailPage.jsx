import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getHistoryItem } from "../api/history";
import MatchScoreCard from "../components/MatchScoreCard";
import SkillGapCard from "../components/SkillGapCard";
import ProjectRecommendations from "../components/ProjectRecommendations";

function HistoryDetailPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function load() {
            setLoading(true);
            setError("");

            try {
                const data = await getHistoryItem(id);
                if (active) setItem(data);
            } catch {
                if (active) setError("Couldn't load this analysis.");
            } finally {
                if (active) setLoading(false);
            }
        }

        load();

        return () => {
            active = false;
        };
    }, [id]);

    return (
        <div>
            <Link className="btn-link" to="/history">← Back to history</Link>

            <div style={{ marginTop: 18 }}>
                {loading && (
                    <div className="panel">
                        <p className="loading-row">
                            <span className="spinner" style={{ color: "#14181f" }} />
                            Loading…
                        </p>
                    </div>
                )}

                {!loading && error && (
                    <div className="panel">
                        <p className="message message-error">{error}</p>
                    </div>
                )}

                {!loading && item && (
                    <>
                        <MatchScoreCard score={item.match_score} summary={item.summary} />
                        <SkillGapCard skills={item.missing_skills} />
                        <ProjectRecommendations projects={item.projects} />
                    </>
                )}
            </div>
        </div>
    );
}

export default HistoryDetailPage;