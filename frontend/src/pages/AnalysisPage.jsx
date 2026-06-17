import { useEffect, useState } from "react";
import { matchResume } from "../api/match";
import MatchScoreCard from "../components/MatchScoreCard";
import SkillGapCard from "../components/SkillGapCard";
import ProjectRecommendations from "../components/ProjectRecommendations";

function AnalysisPage({ resume, job, onEditResume, onEditJob }) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [runToken, setRunToken] = useState(0);

    useEffect(() => {
        let active = true;

        async function load() {
            setLoading(true);
            setError("");

            try {
                const data = await matchResume(resume.id, job.id);
                if (active) setResult(data);
            } catch (err) {
                if (active) {
                    setError(err?.response?.data?.detail || "Couldn't run the analysis.");
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        load();

        return () => {
            active = false;
        };
    }, [resume.id, job.id, runToken]);

    return (
        <div>
            <div className="context-bar">
                <span className="context-chip">
                    Resume: <strong>{resume.fileName}</strong>
                    <button type="button" onClick={onEditResume}>change</button>
                </span>
                <span className="context-chip">
                    Role: <strong>{job.title}{job.company ? ` @ ${job.company}` : ""}</strong>
                    <button type="button" onClick={onEditJob}>change</button>
                </span>
            </div>

            {loading && (
                <div className="panel">
                    <p className="loading-row">
                        <span className="spinner" style={{ color: "#14181f" }} />
                        Comparing the resume against the role…
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="panel">
                    <p className="message message-error">{error}</p>
                    <div className="btn-row" style={{ marginTop: 16 }}>
                        <button className="btn" onClick={() => setRunToken((n) => n + 1)}>
                            Try again
                        </button>
                    </div>
                </div>
            )}

            {!loading && !error && result && (
                <>
                    <MatchScoreCard score={result.match_score} summary={result.summary} />
                    <SkillGapCard skills={result.missing_skills} />
                    <ProjectRecommendations projects={result.projects} />

                    <div className="btn-row" style={{ marginTop: 20 }}>
                        <button className="btn-link" onClick={() => setRunToken((n) => n + 1)}>
                            Run analysis again
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default AnalysisPage;
