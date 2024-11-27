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
  nonMatchedCards: number[]; // Добавляем пропс nonMatchedCards
}

const CardsGrid: React.FC<CardsGridProps> = ({ arrayCards, openedCards, matched, flipCard, numRows, numCols, nonMatchedCards }) => {
  // Вычисляем стиль для сетки (CSS Grid)
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
            isNonMatched={nonMatchedCards.includes(index)} // Используем nonMatchedCards
          />
        );
      })}
    </div>
  );
};

export default CardsGrid;
