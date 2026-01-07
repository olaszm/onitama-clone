import { createContext, ReactNode, useState } from "react";
import { TutorialState } from "../types";

interface TutorialProviderProps {
    children: ReactNode;
}

interface TutorialContextValue {
    tutorial: TutorialState | null;
    setTutorial: (tutorial: TutorialState | null) => void;
}

export const TutorialContext = createContext<TutorialContextValue | null>(null);
// Provider component
export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
    const [tutorial, setTutorial] = useState<TutorialState | null>(null);

    return (
        <TutorialContext.Provider value={{ tutorial, setTutorial }}>
            {children}
        </TutorialContext.Provider>
    );
};
