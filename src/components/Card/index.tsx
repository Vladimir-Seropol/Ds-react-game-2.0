import React from "react";

interface CardProps {
  img: string;
  onClick: () => void;
  isPlaying: boolean;
  iconPlaying: string;
  isNonMatched: boolean; // Новый проп
}

const Card: React.FC<CardProps> = ({ img, onClick, isPlaying, iconPlaying, isNonMatched }) => {
  return (
    <div
      className={`card ${isPlaying ? "playing" : ""} ${isNonMatched ? "non-matched-card" : ""}`} // Добавляем класс для не совпавших карт
      onClick={onClick}
    >
      <div className="inner">
        <div className="front">
          <img src={img} alt="front-card" width="100" />
        </div>
        <div className="back">
          <img src={iconPlaying} alt="playing-card" width="100" />
        </div>
      </div>
    </div>
  );
};

export default Card;
