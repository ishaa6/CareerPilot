const STEPS = [
    { n: 1, label: "Resume" },
    { n: 2, label: "Role" },
    { n: 3, label: "Analysis" }
];

function StepIndicator({ current, resume, job, onSelect }) {
    const detailFor = (n) => {
        if (n === 1) return resume?.fileName;
        if (n === 2) return job?.title;
        return null;
    };

    const isUnlocked = (n) => {
        if (n === 1) return true;
        if (n === 2) return Boolean(resume);
        return Boolean(resume) && Boolean(job);
    };

    return (
        <nav className="stepper" aria-label="Progress">
            {STEPS.map((step, index) => {
                const unlocked = isUnlocked(step.n);
                const isCurrent = step.n === current;
                const isDone = step.n < current;

                return (
                    <div
                        className={
                            "step" +
                            (isCurrent ? " is-current" : "") +
                            (isDone ? " is-done" : "")
                        }
                        key={step.n}
                    >
                        <button
                            type="button"
                            className="step-button"
                            disabled={!unlocked}
                            onClick={() => unlocked && onSelect(step.n)}
                            aria-current={isCurrent ? "step" : undefined}
                        >
                            <span className="step-index">
                                {isDone ? "✓" : String(step.n).padStart(2, "0")}
                            </span>
                            <span className="step-meta">
                                <span className="step-label">{step.label}</span>
                                <span className="step-detail">{detailFor(step.n)}</span>
                            </span>
                        </button>
                        {index < STEPS.length - 1 && <span className="step-rule" />}
                    </div>
                );
            })}
        </nav>
    );
}

export default StepIndicator;
