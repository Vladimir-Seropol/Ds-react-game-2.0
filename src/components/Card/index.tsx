import React from "react";

interface CardProps {
  img: string;
  onClick: () => void;
  isPlaying: boolean;
  iconPlaying: string;
}

const Card: React.FC<CardProps> = ({
  img,
  onClick,
  isPlaying,
  iconPlaying,
}) => {
  return (
    <div
      className={`card ${isPlaying ? "playing" : ""}`}
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