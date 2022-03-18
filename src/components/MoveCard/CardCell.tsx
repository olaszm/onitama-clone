import React from "react";

export function CardCell({
    x, y, value, isActive,
}: {
    x: Number;
    y: Number;
    value: Number;
    isActive: boolean;
}) {
    const getCellStyling = () => {
        if (value === 3) {
            return "#c2c2c2";
        } else if (isActive && value) {
            return "#3cc2fa";
        } else if (value && !isActive) {
            return "#1b86ff";
        }
    };

    return (
        <div
            className="card_cell "
            style={{
                borderTop: x !== 0 ? "1px solid var(--secondary)" : "",
                borderLeft: y !== 0 ? "1px solid var(--secondary)" : "",
                background: getCellStyling(),
            }}
        >
            {" "}
        </div>
    );
}
