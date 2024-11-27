import React from "react";

interface MovesProps {
  moves: number;
}

const Moves: React.FC<MovesProps> = ({ moves }) => {
  return <p className="moves">Количество ходов: {moves}</p>;
};

export default Moves;
