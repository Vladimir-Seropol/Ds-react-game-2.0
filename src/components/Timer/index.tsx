import { useEffect, useState, useRef } from "react";

interface TimerProps {
  isActive: boolean;
  areAllCardsOpened: boolean;
  updateGameTime: (time: number) => void;
  resetTimeFlag: boolean;  
}

const Timer: React.FC<TimerProps> = ({ isActive, areAllCardsOpened, updateGameTime, resetTimeFlag }) => {
  const [time, setTime] = useState(0); 
  const intervalRef = useRef<NodeJS.Timeout | null>(null); 

  // Сброс времени при изменении флага
  useEffect(() => {
    if (resetTimeFlag) {
      setTime(0);  
    }
  }, [resetTimeFlag]); 

  useEffect(() => {
    if (isActive && !areAllCardsOpened) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1); 
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, areAllCardsOpened]);

  useEffect(() => {
    updateGameTime(time);  
  }, [time, updateGameTime]);

  return <span className="timer">Время: {time} секунд.</span>;
};

export default Timer;
