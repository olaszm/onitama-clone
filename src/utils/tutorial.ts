import {
    TutorialStageConfig,
    TutorialStageName,
    GameState,
    Position,
} from "../types";
import { newGame } from "../reducers/originalReducer";

export const TUTORIAL_STAGES: readonly TutorialStageConfig[] = [
    {
        name: "select_piece",
        title: "Select Your Piece",
        description: "Learn how to select a piece to move",
        hint: "Click on one of your RED pieces (at the bottom of the board) to select it.",
        allowedActions: ["piece_select"],
        requiredAction: {
            type: "piece_select",
            validation: (data: { piece: any; player: string }) => {
                // Must select a red piece (red is the player in tutorial)
                return data.piece && data.piece.player === "red";
            },
        },
    },
    {
        name: "select_card",
        title: "Select a Movement Card",
        description: "Learn how to select a card to move with",
        hint: "Click on one of the red cards on the left to select your movement pattern.",
        allowedActions: ["piece_select", "card_select"],
        requiredAction: {
            type: "card_select",
            validation: (data: { card: any; player: string }) => {
                // Must select a card that belongs to red
                return data.card && data.player === "red";
            },
        },
    },
    {
        name: "move_piece",
        title: "Move Your Piece",
        description: "Execute a move by clicking on a highlighted destination",
        hint: "Click on one of the highlighted squares to move your selected piece to that location.",
        allowedActions: ["piece_select", "card_select", "move"],
        requiredAction: {
            type: "move",
            validation: (data: { from: Position; to: Position; isValidMove: boolean }) => {
                // Just needs to be a valid move
                return data.isValidMove === true;
            },
        },
    },
    {
        name: "card_rotation",
        title: "Card Rotation",
        description: "Understand how cards rotate after a move",
        hint: "Notice how the card you used moved to the side, and the side card came to your hand. Now select a blue piece to continue!",
        allowedActions: ["piece_select", "card_select", "move"],
        requiredAction: {
            type: "piece_select",
            validation: (data: { piece: any }) => {
                // Blue's turn - select a blue piece (AI will move, then back to tutorial)
                return data.piece && data.piece.player === "blue";
            },
        },
    },
    {
        name: "win_condition",
        title: "Win Conditions",
        description: "Learn the two ways to win",
        hint: "Move one more piece strategically. You can win by: 1) Moving your master to the blue shrine (top-center), or 2) Capturing the blue master piece.",
        allowedActions: ["piece_select", "card_select", "move"],
        requiredAction: {
            type: "move",
            validation: () => {
                // Just complete any valid move
                return true;
            },
        },
    },
    {
        name: "completed",
        title: "Tutorial Complete!",
        description: "You've learned the basics of Onitama!",
        hint: "Congratulations! You can now play a full game. Head to Start to play against the AI.",
        allowedActions: [],
    },
];

export const getTutorialStageByName = (
    name: TutorialStageName
): TutorialStageConfig | undefined => {
    return TUTORIAL_STAGES.find((stage) => stage.name === name);
};

export const getNextTutorialStage = (
    currentName: TutorialStageName
): TutorialStageName | null => {
    const currentIndex = TUTORIAL_STAGES.findIndex(
        (stage) => stage.name === currentName
    );
    if (currentIndex === -1 || currentIndex >= TUTORIAL_STAGES.length - 1) {
        return null;
    }
    return TUTORIAL_STAGES[currentIndex + 1].name;
};

export const createTutorialGameState = (): GameState => {
    // Create a game state suitable for tutorial
    // Red is human player, Blue is opponent (AI won't move, just shows board state)
    return newGame(undefined, "Easy");
};

export const isActionAllowed = (
    action: string,
    stageName: TutorialStageName
): boolean => {
    const stage = getTutorialStageByName(stageName);
    if (!stage) return false;
    return stage.allowedActions.includes(action);
};

export const validateTutorialAction = (
    action: string,
    stageName: TutorialStageName,
    actionData: any
): boolean => {
    const stage = getTutorialStageByName(stageName);
    if (!stage || !stage.requiredAction) return false;

    if (stage.requiredAction.type !== action) {
        return false;
    }

    return stage.requiredAction.validation(actionData);
};
