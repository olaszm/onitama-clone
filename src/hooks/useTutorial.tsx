import { useEffect, useState } from "react";
import { TutorialStep, TutorialState, UIState } from "../types";

export const useTutorial = (steps: TutorialStep[], uiState: UIState): TutorialState => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [completed, setCompleted] = useState<boolean>(false);

    const next = (): void => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            complete();
        }
    };

    const prev = (): void => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const skip = (): void => {
        setIsActive(false);
        setCompleted(true);
    };

    const complete = (): void => {
        setIsActive(false);
        setCompleted(true);
    };

    const start = (): void => {
        setIsActive(true);
        setCurrentStep(0);
        setCompleted(false);
    };

    const goTo = (stepIndex: number): void => {
        if (stepIndex >= 0 && stepIndex < steps.length) {
            setCurrentStep(stepIndex);
        }
    };

    return {
        currentStep,
        isActive,
        completed,
        next,
        prev,
        skip,
        complete,
        start,
        goTo,
        totalSteps: steps.length,
        currentStepData: steps[currentStep],
    };
};

