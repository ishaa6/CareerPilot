import ScoreGauge from "./ScoreGauge";

function verdict(score) {
    if (score >= 70) {
        return { tone: "good", label: "Strong fit" };
    }
    if (score >= 40) {
        return { tone: "warn", label: "Worth tailoring" };
    }
    return { tone: "bad", label: "Significant gaps" };
}

function MatchScoreCard({ score, summary }) {
    const v = verdict(score);

    return (
        <div className="panel">
            <h2 className="panel-title">Match score</h2>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <ScoreGauge score={score} />
                    <span className={`verdict-pill verdict-${v.tone}`}>
                        <span className="verdict-dot" />
                        {v.label}
                    </span>
                </div>
            </div>

            {summary && <p className="summary-text">{summary}</p>}
        </div>
    );
}

export default MatchScoreCard;
