import React from "react";
import { ReactComponent as Logo } from "../assets/emblem_white.svg";

function Footer() {
    const getCurrentYear = (): string => {
        const date = new Date()
        return date.getFullYear().toString()
    }

    return (
        <div className="py-5 flex flex-row justify-between items-center gap-4">
            <div className="flex flex-row justify-evenly items-center gap-2">
                <Logo style={{ height: "30px" }} />
                <small>
                    All rights reserved &copy; {getCurrentYear()}
                </small>
            </div>

            <div className="flex flex-row justify-evenly items-center gap-2">
                <a
                    href="https://github.com/olaszm/onitama-clone"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#1565C0] transition-colors"
                >
                    Repo
                </a>
                <a
                    target="_blank"
                    href="https://martinolasz.dev"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#1565C0] transition-colors"
                >
                    Portfolio
                </a>
            </div>
        </div>
    );
}

export default Footer;
