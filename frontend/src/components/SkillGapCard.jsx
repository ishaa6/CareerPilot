function SkillGapCard({ skills }) {
    const hasGaps = skills && skills.length > 0;

    return (
        <div className="panel">
            <h2 className="panel-title">
                Skills to close
                {hasGaps && <span className="gap-count">{skills.length}</span>}
            </h2>

            {hasGaps ? (
                <ul className="gap-list">
                    {skills.map((skill, index) => (
                        <li className="gap-row" key={index}>
                            <span className="gap-marker" />
                            {skill}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty-state">
                    <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M4 12.5l5 5L20 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p>No major skill gaps detected.</p>
                </div>
            )}
        </div>
    );
}

export default SkillGapCard;
