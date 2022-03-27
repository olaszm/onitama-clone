import React from "react";
import { reducer } from "../reducers/originalReducer";
import {
  Cell,
  InitGameState,
  initialGameState,
  MoveCard,
  Piece,
  Position,
} from "../types";
import { INITIAL_BOARD, MOVES, ULTIMATE } from "../constants";
import { getCell, getPiece, highlightValidMoves } from "../utils/helpers";

const makeMove = (
  from: Position,
  to: Position,
  {
    moveCard = {name: 'ultimate', moves: ULTIMATE},
    gameState = initialGameState,
  }: { moveCard?: MoveCard; gameState?: InitGameState }
) => {
  let initState = {
    ...gameState,
    selectedCell: from,
    selectedMoveCard: moveCard,
  };

  const currentCell: Cell = getCell(initState.gameBoard, from);

  initState.gameBoard = highlightValidMoves(
    initState.gameBoard,
    initState.selectedMoveCard,
    from,
    initState.currentPlayer
  );

  initState = reducer(initState, {
    type: "SELECT",
    payload: to,
  });

  return initState;
};

test("test initial gameboard", () => {
  const state = reducer(initialGameState, { type: "START_GAME" });

  expect(state.selectedCell).toBeUndefined();
  expect(state.redMoveCards.length).toEqual(2);
  expect(state.blueMoveCards.length).toEqual(2);
  expect(state.isGameOver).toBe(false);
});

test("should not select empty cell", () => {
  const position: Position = { x: 2, y: 2 };

  const state = reducer(initialGameState, {
    type: "SELECT",
    payload: position,
  });

  expect(state.selectedCell).toBeUndefined();
});

test("should select piece if nothing is selected", () => {
  const position: Position = { x: 0, y: 4 };
  let state = makeMove(position, { x: 0, y: 0 }, {});
  const currentlySelectedCell =
    state.gameBoard[state.selectedCell.y][state.selectedCell.x];

  const nextCellForward = getCell(state.gameBoard, {
    x: state.selectedCell.x,
    y: state.selectedCell.y - 1,
  });
  expect(state.selectedCell).toStrictEqual({ x: 0, y: 4 });
  expect(currentlySelectedCell.isValid).toBe(false);
  expect(nextCellForward.isValid).toBe(true);
  expect(currentlySelectedCell.piece).toStrictEqual({
    type: "pawn",
    side: "red",
  });
});

test("should move to valid cell", () => {
  const currentPosition: Position = { x: 0, y: 4 };
  const targetPosition: Position = { x: 0, y: 3 };

  let gameState = makeMove(currentPosition, targetPosition, {});

  const previousCell: Cell = getCell(gameState.gameBoard, currentPosition);
  const targetCell: Cell =
    gameState.gameBoard[targetPosition.y][targetPosition.x];

  expect(previousCell.piece).toBe(0);
  expect(targetCell.piece).toStrictEqual({ type: "pawn", side: "red" });
  expect(gameState.currentPlayer).toEqual("blue");
});

test("should select a different piece with same color", () => {
  const currentPosition: Position = { x: 0, y: 4 };
  const targetPosition: Position = { x: 1, y: 4 };
  let state = makeMove(currentPosition, targetPosition, {});

  expect(state.selectedCell).toStrictEqual({ x: 1, y: 4 });
});

test("should not select invalid empty cell when a piece is selected", () => {
  const currentPosition: Position = { x: 0, y: 4 };
  const targetPosition: Position = { x: 0, y: 0 };
  let gameState = makeMove(currentPosition, targetPosition, {});
  const previousCell = getCell(gameState.gameBoard, currentPosition);
  const targetCell = getCell(gameState.gameBoard, targetPosition);

  expect(previousCell.piece).toStrictEqual({ type: "pawn", side: "red" });
  expect(targetCell.isValid).toBe(false);
});

test("should take other piece", () => {
  const targetPosition: Position = { x: 0, y: 2 };
  let gameState = makeMove({ x: 0, y: 4 }, targetPosition, {});
  gameState = makeMove({ x: 0, y: 0 }, targetPosition, { gameState });

  expect(gameState.selectedCell).toBeUndefined();
  const targetPiece: Piece | 0 = getPiece(gameState.gameBoard, targetPosition);
  expect(targetPiece && targetPiece.side).toBe("blue");
  expect(gameState.currentPlayer).toEqual("red");
});

test("should take king with king and game over", () => {
  const currentPosition: Position = { x: 2, y: 4 };
  const targetPosition: Position = { x: 2, y: 2 };

  let gameState = makeMove(currentPosition, targetPosition, {});

  let targetPiece: Piece | 0 = getPiece(gameState.gameBoard, targetPosition);

  expect(targetPiece && targetPiece.type).toBe("king");
  expect(targetPiece && targetPiece.side).toBe("red");

  gameState = makeMove({ x: 2, y: 0 }, targetPosition, { gameState });

  targetPiece = getPiece(gameState.gameBoard, targetPosition);
  expect(targetPiece && targetPiece.type).toBe("king");
  expect(targetPiece && targetPiece.side).toBe("blue");
  expect(gameState.isGameOver).toBe(true);
});

test("should take shrine and game over", () => {
  let gameState = makeMove(
    { x: 0, y: 4 },
    { x: 0, y: 2 },
    { moveCard: {name:'ultimate', moves: ULTIMATE} }
  );
  gameState = makeMove({ x: 2, y: 0 }, { x: 2, y: 2 }, { gameState });
  gameState = makeMove({ x: 0, y: 2 }, { x: 2, y: 0 }, { gameState });

  const blueShrineCell: Cell = getCell(gameState.gameBoard, { x: 2, y: 0 });
  const redOnShire: Piece | 0 = getPiece(gameState.gameBoard, { x: 2, y: 0 });

  expect(blueShrineCell.isShrine).toStrictEqual({ side: "blue" });
  expect(redOnShire && redOnShire.side).toBe("red");
  expect(gameState.isGameOver).toBe(true);
});

test("should reset game", () => {
  const initState = {
    ...initialGameState,
    selectedMoveCard: MOVES[0],
    gameBoard: INITIAL_BOARD,
  };
  const state = reducer(initState, { type: "RESET_GAME" });

  expect(state.selectedCell).toBeUndefined();
  expect(state.redMoveCards.length).toEqual(2);
  expect(state.blueMoveCards.length).toEqual(2);
  expect(state.isGameOver).toBe(false);

  expect(state.gameBoard[4].every((el: Cell) => el.piece != 0)).toBe(true);
});

test("should swap rotating and selected move card", () => {
  const initState = {
    ...initialGameState,
    selectedMoveCard: MOVES[1],
    redMoveCards: [MOVES[1], MOVES[2]],
    blueMoveCards: [MOVES[3], MOVES[4]],
    rotatingCard: MOVES[0],
    gameBoard: INITIAL_BOARD,
  };

  let gameState = makeMove(
    { x: 0, y: 4 },
    { x: 1, y: 3 },
    {
      moveCard: initState.selectedMoveCard,
      gameState: initState,
    }
  );

  expect(gameState.selectedMoveCard).toBeUndefined();
  expect(gameState.rotatingCard && gameState.rotatingCard.name).toBe("cobra");
  expect(gameState.redMoveCards[0].name).toBe("crane");
  expect(gameState.currentPlayer).toBe("blue");

  gameState = makeMove(
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    {
      moveCard: gameState.blueMoveCards[0],
      gameState
    }
  );

  expect(gameState.selectedMoveCard).toBeUndefined();
  expect(gameState.rotatingCard && gameState.rotatingCard.name).toBe("rooster");
  expect(gameState.blueMoveCards[0].name).toBe("cobra");
  expect(gameState.currentPlayer).toBe("red");
});
