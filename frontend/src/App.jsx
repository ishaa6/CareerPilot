import { useState } from "react";
import StepIndicator from "./components/StepIndicator";
import ResumeUpload from "./components/ResumeUpload";
import JDForm from "./components/JDForm";
import AnalysisPage from "./pages/AnalysisPage";

function BrandMark() {
    return (
        <svg className="brand-mark" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="21" stroke="#14181f" strokeWidth="3" />
            <path d="M13 30a12.4 12.4 0 0 1 22 0" stroke="#d98a2e" strokeWidth="3" strokeLinecap="round" />
            <circle cx="24" cy="24" r="3" fill="#14181f" />
            <line x1="24" y1="24" x2="32" y2="17" stroke="#14181f" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function App() {
    const [step, setStep] = useState(1);
    const [resume, setResume] = useState(null);
    const [job, setJob] = useState(null);

    const goToStep = (n) => {
        if (n === 1) return setStep(1);
        if (n === 2 && resume) return setStep(2);
        if (n === 3 && resume && job) return setStep(3);
    };

    return (
        <div className="app-shell">
            <header className="app-header">
                <a className="brand" href="/">
                    <span>
                        <span className="brand-name">CareerPilot</span>
                    </span>
                </a>
            </header>

            <main className="app-main">
                <StepIndicator current={step} resume={resume} job={job} onSelect={goToStep} />

                {step === 1 && (
                    <ResumeUpload
                        onUploaded={(data) => {
                            setResume(data);
                            setStep(2);
                        }}
                    />
                )}

                {step === 2 && (
                    <JDForm
                        onCreated={(data) => {
                            setJob(data);
                            setStep(3);
                        }}
                    />
                )}

                {step === 3 && resume && job && (
                    <AnalysisPage
                        resume={resume}
                        job={job}
                        onEditResume={() => setStep(1)}
                        onEditJob={() => setStep(2)}
                    />
                )}
            </main>

            <footer className="app-footer">CareerPilot</footer>
        </div>
    );
}

export default App;
