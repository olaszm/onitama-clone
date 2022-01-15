import "../styles/grid.css";
import Cell from "./Cell";

function GameBoard() {
  const state: number[][] = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ];

  return (
    <div className="grid">
      {state.map((item, y) => {
        return (
          <>
            {item.map((i, x) => {
              return <Cell key={x} position={{x,y}} piece={i}/>;
            })}
          </>
        );
      })}
    </div>
  );
}

export default GameBoard;
