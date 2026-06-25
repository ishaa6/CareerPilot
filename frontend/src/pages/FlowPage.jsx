import { useState } from "react";
import StepIndicator from "../components/StepIndicator";
import ResumeUpload from "../components/ResumeUpload";
import JDForm from "../components/JDForm";
import AnalysisPage from "./AnalysisPage";

function FlowPage() {
    const [step, setStep] = useState(1);
    const [resume, setResume] = useState(null);
    const [job, setJob] = useState(null);

    const goToStep = (n) => {
        if (n === 1) return setStep(1);
        if (n === 2 && resume) return setStep(2);
        if (n === 3 && resume && job) return setStep(3);
    };

    return (
        <>
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
        </>
    );
}

export default FlowPage;