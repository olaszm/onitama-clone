import { useEffect, useState } from "react";

interface OverlayProps {
    target: string;
}

export const Overlay: React.FC<OverlayProps> = ({ target }) => {
    const [rect, setRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const updateRect = (): void => {
            const element = document.querySelector(target) as HTMLElement;
            if (element) {
                setRect(element.getBoundingClientRect());
            }
        };

        updateRect();
        window.addEventListener('resize', updateRect);
        window.addEventListener('scroll', updateRect);

        return () => {
            window.removeEventListener('resize', updateRect);
            window.removeEventListener('scroll', updateRect);
        };
    }, [target]);

    if (!rect) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000]" />
            <div
                className="fixed bg-white bg-opacity-0 z-[10001] pointer-events-none ring-4 ring-blue-500 ring-opacity-50 rounded"
                style={{
                    top: `${rect.top - 4}px`,
                    left: `${rect.left - 4}px`,
                    width: `${rect.width + 8}px`,
                    height: `${rect.height + 8}px`
                }}
            />
        </>
    );
};
