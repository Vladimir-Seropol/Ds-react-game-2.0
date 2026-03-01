import React from "react";
import Card from "../Card";
import iconPlaying from "/images/26.jpg";
import { CardType } from "../../pages/Game";

interface CardsGridProps {
  arrayCards: CardType[];
  openedCards: number[];
  matched: number[];
  flipCard: (index: number) => void;
  numRows: number; 
  numCols: number;
}

const CardsGrid: React.FC<CardsGridProps> = ({ arrayCards, openedCards, matched, flipCard, numRows, numCols }) => {
 
  const gridStyle = {
    gridTemplateColumns: `repeat(${numCols}, 1fr)`, 
    gridTemplateRows: `repeat(${numRows}, auto)`, 
  };

  return (
    <div className="cards" style={gridStyle}>
      {arrayCards.map((item, index) => {
        const isPlaying = openedCards.includes(index) || matched.includes(item.id);

        return (
          <Card
            key={index}
            img={item.img}
            onClick={() => flipCard(index)}
            isPlaying={isPlaying}
            iconPlaying={iconPlaying}
          />
        );
      })}
    </div>
  );
};

export default CardsGrid;
