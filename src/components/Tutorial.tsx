import { TutorialStep } from "../types";
import { Tooltip } from "./Tooltip";
import { Overlay } from "./TutorialOverlay";

interface TutorialProps {
    steps: TutorialStep[];
    isActive: boolean;
    currentStep: number;
    currentStepData: TutorialStep | undefined;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
}

// Main Tutorial component
export const Tutorial: React.FC<TutorialProps> = ({
    steps,
    isActive,
    currentStep,
    currentStepData,
    onNext,
    onPrev,
    onSkip,
}) => {
    if (!isActive || !currentStepData) return null;

    const step = currentStepData;

    return (
        <>
            <Overlay target={step.target} />
            <Tooltip
                step={step}
                onNext={onNext}
                onPrev={onPrev}
                onSkip={onSkip}
                isFirst={currentStep === 0}
                isLast={currentStep === steps.length - 1}
                currentStep={currentStep}
                totalSteps={steps.length}
            />
        </>
    );
};
