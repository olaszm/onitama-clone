import { useEffect, useReducer } from "react";
import "../styles/grid.css";
import GameCell from "./GameCell";
import { Cell, MoveCard, initialGameState } from "../types/index";

import MoveCardElement from "./MoveCardElement";
import { reducer } from "../reducers/originalReducer";

const flexContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "2rem",
  width: "85%",
  margin: "0 auto",
};

function GameBoard() {
  const [gameState, dispatch] = useReducer(reducer, initialGameState);

  const renderCells = (state: Cell[][]) => {
    return state.map((item, y) => {
      return (
        <>
          {item.map((i, x) => {
            let { selectedCell } = gameState;

            return (
              <GameCell
                isSelected={
                  !selectedCell
                    ? false
                    : selectedCell.x === x && selectedCell.y === y
                    ? true
                    : false
                }
                key={`${x}-${y}`}
                position={{ x, y }}
                piece={i}
                handleClick={(pos) =>
                  dispatch({ type: "SELECT", payload: pos })
                }
              />
            );
          })}
        </>
      );
    });
  };

  useEffect(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => dispatch({ type: "RESET_GAME" })}>Reset</button>
      </div>
      {gameState.isGameOver && (
        <>
          <p>Game over!</p>
          <button onClick={() => dispatch({ type: "RESET_GAME" })}>
            Reset
          </button>
        </>
      )}
      <div
        style={{
          margin: "0 auto",
          maxWidth: "200px",
          color: "blue",
        }}
      >
        {gameState.blueMoveCards.map((card: MoveCard, idx: number) => {
          return (
            <div
              key={idx}
              onClick={() => {
                if (gameState.currentPlayer === "blue") {
                  dispatch({ type: "SELECT_MOVE_CARD", payload: card });
                }
              }}
            >
              <MoveCardElement isActive={false} move={card} />
            </div>
          );
        })}
      </div>
      <div style={flexContainerStyle}>
        <div className="grid_item">{gameState.rotatingCard?.name}</div>
        <div className="grid">{renderCells(gameState.gameBoard)}</div>
      </div>

      <div
        style={{
          margin: "0 auto",
          maxWidth: "200px",
          color: "red",
        }}
      >
        {gameState.redMoveCards.map((card: MoveCard, idx: number) => {
          let isActive = gameState.selectedMoveCard
            ? gameState.selectedMoveCard.name
            : "";
          return (
            <div
              onClick={() => {
                if (gameState.currentPlayer === "red") {
                  dispatch({ type: "SELECT_MOVE_CARD", payload: card });
                }
              }}
            >
              <MoveCardElement
                key={idx}
                move={card}
                isActive={isActive === card.name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GameBoard;
