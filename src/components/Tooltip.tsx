import { useState, useRef, useEffect } from "react";
import { TooltipPosition, Placement, TutorialStep } from "../types";

export interface TooltipProps {
    step: TutorialStep;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
    isFirst: boolean;
    isLast: boolean;
    currentStep: number;
    totalSteps: number;
}

// Tooltip positioning utility
const getTooltipPosition = (
    targetRect: DOMRect,
    tooltipRect: DOMRect,
    placement: Placement = 'bottom'
): TooltipPosition => {
    const spacing = 12;
    const positions: Record<Placement, TooltipPosition> = {
        top: {
            top: targetRect.top - tooltipRect.height - spacing,
            left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
        },
        bottom: {
            top: targetRect.bottom + spacing,
            left: targetRect.left + (targetRect.width - tooltipRect.width) / 2
        },
        left: {
            top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
            left: targetRect.left - tooltipRect.width - spacing
        },
        right: {
            top: targetRect.top + (targetRect.height - tooltipRect.height) / 2,
            left: targetRect.right + spacing
        }
    };

    return positions[placement];
};

// Tooltip component
export const Tooltip: React.FC<TooltipProps> = ({
    step,
    onNext,
    onPrev,
    onSkip,
    isFirst,
    isLast,
    currentStep,
    totalSteps,
}) => {
    const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updatePosition = (): void => {
            const target = document.querySelector(step.target) as HTMLElement;
            if (target && tooltipRef.current) {
                const targetRect = target.getBoundingClientRect();
                const tooltipRect = tooltipRef.current.getBoundingClientRect();
                const pos = getTooltipPosition(targetRect, tooltipRect, step.placement);
                setPosition(pos);

                // Highlight target
                target.style.position = 'relative';
                target.style.zIndex = '10001';
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
            const target = document.querySelector(step.target) as HTMLElement;
            if (target) {
                target.style.zIndex = '';
            }
        };
    }, [step.target, step.placement]);

    return (
        <div
            ref={tooltipRef}
            className="fixed bg-main rounded-lg shadow-2xl p-5 max-w-sm z-[10002]"
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <button
                    onClick={onSkip}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                    ×
                </button>
            </div>

            <p className="mb-4 text-sm leading-relaxed">{step.content}</p>

            <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 w-6 rounded-full transition-colors ${i === currentStep ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                <div className="flex gap-2">
                    {!isFirst && (
                        <button
                            onClick={onPrev}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={onNext}
                        //TODO: Once we have the requred action flow setup we want to disable the btn until the user completes a certain action
                        className={`px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium ${false ? "disabled:opacity-50" : "hover:bg-blue-700"} `}
                    >
                        {isLast ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};
