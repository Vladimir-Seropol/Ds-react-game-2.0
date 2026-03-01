import { useEffect, useState, useRef } from "react";

interface TimerProps {
  isActive: boolean;
  updateGameTime: (time: number) => void;
  resetTimeFlag: boolean;
}

const Timer: React.FC<TimerProps> = ({
  isActive,
  updateGameTime,
  resetTimeFlag,
}) => {
  const [time, setTime] = useState(0);


  const intervalRef = useRef<number | null>(null);


  useEffect(() => {
    if (resetTimeFlag) {
      setTime(0);
    }
  }, [resetTimeFlag]);


  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive]);


  useEffect(() => {
    updateGameTime(time);
  }, [time, updateGameTime]);

  return <span className="timer">Время: {time} секунд</span>;
};

export default Timer;