import React from "react";

export function CardCell({
    x, y, value,
}: {
    x: Number;
    y: Number;
    value: Number;
}) {
    const getCellStyling = () => {
        if (value === 3) {
            return "var(--main)";
        } else if(value) {
            return "var(--active)"
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
