// RestartButton.tsx
import React from "react";

interface RestartButtonProps {
  text: string; 
  onClick: () => void; 
  style?: React.CSSProperties;
}

const RestartButton: React.FC<RestartButtonProps> = ({ text, onClick, style }) => {
  return (
    <button className="button-restart" onClick={onClick} style={style}>
      {text}
    </button>
  );
};

export default RestartButton;


