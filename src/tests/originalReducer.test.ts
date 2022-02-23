import React from "react";
import { reducer } from "../reducers/originalReducer";
import { Cell, InitGameState, initialGameState, Position } from "../types";
import { INITIAL_BOARD, MOVES } from "../constants";

test("test initial gameboard", () => {
  const state = reducer(initialGameState, { type: "START_GAME" });

  expect(state.selectedCell).toBeUndefined();
  expect(state.redMoveCards.length).toEqual(2);
  expect(state.blueMoveCards.length).toEqual(2);
  expect(state.isGameOver).toBe(false);
});

test("should select empty cell", () => {
  const position: Position = { x: 2, y: 2 };

  const state = reducer(initialGameState, {
    type: "SELECT",
    payload: position,
  });

  expect(state.selectedCell).toBeUndefined();
});

test("should select piece if nothing is selected", () => {
  const position: Position = { x: 0, y: 4 };
  const initState = { ...initialGameState, selectedMoveCard: MOVES[0] };
  const state = reducer(initState, { type: "SELECT", payload: position });

  const currentlySelectedCell =
    initState.gameBoard[state.selectedCell.y][state.selectedCell.x];
  const nextCellForward =
    initState.gameBoard[state.selectedCell.y][state.selectedCell.x + 1];
  expect(state.selectedCell).toStrictEqual({ x: 0, y: 4 });
  expect(currentlySelectedCell.isValid).toBe(false);
  expect(nextCellForward.isValid).toBe(true);
  expect(currentlySelectedCell.piece).toStrictEqual({
    type: "pawn",
    side: "red",
  });
});

test("select valid empty cell when a piece is selected", () => {
  const currentPosition: Position = { x: 0, y: 4 };
  const targetPosition: Position = { x: 0, y: 3 };
  const initState = {
    ...initialGameState,
    selectedCell: currentPosition,
    selectedMoveCard: MOVES[0],
  };

  const state: InitGameState = reducer(initState, {
    type: "SELECT",
    payload: targetPosition,
  });

  const previousCell = state.gameBoard[currentPosition.y][currentPosition.x];
  const targetCell = state.gameBoard[targetPosition.y][targetPosition.x];
  expect(targetCell.piece).toStrictEqual({ type: "pawn", side: "red" });
  expect(previousCell.piece).toBe(0);
  expect(state.currentPlayer).toEqual("blue");
});

test("select different piece with same color if piece is selected", () => {
  const currentPosition: Position = { x: 0, y: 4 };
  const targetPosition: Position = { x: 1, y: 4 };

  const initState = {
    ...initialGameState,
    selectedCell: currentPosition,
    selectedMoveCard: MOVES[0],
  };

  const state: InitGameState = reducer(initState, {
    type: "SELECT",
    payload: targetPosition,
  });

  const previousCell = state.gameBoard[currentPosition.y][currentPosition.x];
  const targetCell = state.gameBoard[targetPosition.y][targetPosition.x];

  expect(state.selectedCell).toStrictEqual({x: 1 , y: 4})
});

test("select invalid empty cell when a piece is selected", () => {
  const currentPosition: Position = { x: 0, y: 4 };
  const targetPosition: Position = { x: 0, y: 0 };
  const initState = {
    ...initialGameState,
    selectedCell: currentPosition,
    selectedMoveCard: MOVES[0],
  };

  const state: InitGameState = reducer(initState, {
    type: "SELECT",
    payload: targetPosition,
  });

  
  const previousCell = state.gameBoard[currentPosition.y][currentPosition.x];
  const targetCell = state.gameBoard[targetPosition.y][targetPosition.x];
  expect(previousCell.piece).toStrictEqual({ type: "pawn", side: "red" });
  expect(targetCell.isValid).toBe(true)
});

test("should reset game", () => {
  const initState = { ...initialGameState, selectedMoveCard: MOVES[0], gameBoard: INITIAL_BOARD };
  const state = reducer(initState, { type: "RESET_GAME" });

  expect(state.selectedCell).toBeUndefined();
  expect(state.redMoveCards.length).toEqual(2);
  expect(state.blueMoveCards.length).toEqual(2);
  expect(state.isGameOver).toBe(false);

  expect(state.gameBoard[4].every((el: Cell) => el.piece != 0)).toBe(true);
});
