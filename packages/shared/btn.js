"use client"
import React from "react";

function ButtonTheme() {
    const handleThemeClick = () => {
        setSelectedTheme();
    };
    return (
        <div>
            <button onClick={handleThemeClick}>
                learn more
            </button>
        </div>
    )
}
export { Button, ButtonTheme }
