import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import CardsGrid from "../../components/CardsGrid";
import Moves from "../../components/Moves";
import RestartButton from "../../components/Button";
import Timer from "../../components/Timer";
import { useGameContext } from "../../components/GameContext";
import style from "./style.module.css";

const icons = Array.from(
  { length: 26 },
  (_, index) => `/images/${(index + 1).toString().padStart(2, "0")}.jpg`
);

export interface CardType {
  id: number;
  img: string;
}

type GameStatus = "idle" | "playing" | "checking" | "finished";

function Game() {
  const [arrayCards, setArrayCards] = useState<CardType[]>([]);
  const [openedCards, setOpenedCards] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
  const [gameTime, setGameTime] = useState(0);

  const [numRows, setNumRows] = useState(2);
  const [numCols, setNumCols] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetTimeFlag, setResetTimeFlag] = useState(false);

  const { setStats } = useGameContext();
  const navigate = useNavigate();


  const generateCardPairs = (numPairs: number) => {
    const cards: CardType[] = [];
    for (let i = 0; i < numPairs; i++) {
      cards.push({ id: i + 1, img: icons[i % icons.length] });
      cards.push({ id: i + 1, img: icons[i % icons.length] });
    }
    return cards;
  };

  const shuffleCards = (array: CardType[]): CardType[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };


  const resetGame = () => {
    const totalCards = numRows * numCols;
    const numPairs = totalCards / 2;
    const cards = shuffleCards(generateCardPairs(numPairs));

    setArrayCards(cards);
    setOpenedCards([]);
    setMatched([]);
    setMoves(0);
    setGameStatus("idle");
    setGameTime(0);
    setResetTimeFlag(true);
  };

  useEffect(() => {
    resetGame();
  }, [numRows, numCols]);

  useEffect(() => {
    if (resetTimeFlag) {
      setResetTimeFlag(false);
    }
  }, [resetTimeFlag]);


  const flipCard = (index: number) => {
    if (
      gameStatus === "checking" ||
      gameStatus === "finished" ||
      openedCards.includes(index) ||
      matched.includes(arrayCards[index].id)
    ) {
      return;
    }

    if (gameStatus === "idle") {
      setGameStatus("playing");
    }

    setOpenedCards((prev) => [...prev, index]);
    setMoves((prev) => prev + 1);
  };


  useEffect(() => {
    if (openedCards.length !== 2) return;

    setGameStatus("checking");

    const [firstIndex, secondIndex] = openedCards;
    const firstCard = arrayCards[firstIndex];
    const secondCard = arrayCards[secondIndex];

    const isMatch = firstCard.id === secondCard.id;

    setTimeout(() => {
      if (isMatch) {
        setMatched((prev) => {
          const updated = [...prev, firstCard.id];

          if (updated.length === arrayCards.length / 2) {
            setGameStatus("finished");
          } else {
            setGameStatus("playing");
          }

          return updated;
        });
      } else {
        setGameStatus("playing");
      }

      setOpenedCards([]);
    }, 1000);
  }, [openedCards, arrayCards]);


  useEffect(() => {
    if (gameStatus !== "finished") return;

    const newStats = { moves, gameTime, numRows, numCols };
    setStats(newStats);

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    const storedSessionHistory = JSON.parse(
      localStorage.getItem("sessionHistory") || "[]"
    );

    const newSession = { ...newStats, date: formattedDate };

    const isDuplicate = storedSessionHistory.some(
      (session: { date: string; moves: number; gameTime: number }) =>
        session.date === newSession.date &&
        session.moves === newSession.moves &&
        session.gameTime === newSession.gameTime
    );

    if (!isDuplicate) {
      localStorage.setItem(
        "sessionHistory",
        JSON.stringify([...storedSessionHistory, newSession])
      );
    }
  }, [gameStatus]);


  const updateGameTime = (time: number) => {
    setGameTime(time);
  };

  const handleFieldSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;

    const sizes: Record<string, [number, number]> = {
      "2x3": [2, 3],
      "3x4": [3, 4],
      "4x4": [4, 4],
      "4x5": [4, 5],
      "4x6": [4, 6],
    };

    const selected = sizes[value];
    if (selected) {
      setNumRows(selected[0]);
      setNumCols(selected[1]);
    }

    closeModal();
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    const modalOverlay: any = document.querySelector(`.${style.modal_overlay}`);
    modalOverlay?.classList.remove(style.show);

    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };


  return (
    <div className="container">
      <div className={style.settings_dlock}>
        <div className={style.settings_icon}>
          <RestartButton
            text="⚙️"
            onClick={openModal}
            style={{ margin: 0, position: "absolute", top: 0, right: 0 }}
          />
        </div>

        {isModalOpen && (
          <div
            className={`${style.modal_overlay} ${isModalOpen ? style.show : ""}`}
            onClick={closeModal}
          >
            <div
              className={style.congrats_content}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Выберите размер поля:</h2>
              <select onChange={handleFieldSizeChange}>
                <option value="2x3">2x3</option>
                <option value="3x4">3x4</option>
                <option value="4x4">4x4</option>
                <option value="4x5">4x5</option>
                <option value="4x6">4x6</option>
              </select>
              <RestartButton
                text="Закрыть"
                onClick={closeModal}
                style={{ fontSize: "12px" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="counters">
        <Moves moves={moves} />
        <Timer
          isActive={gameStatus === "playing"}
          updateGameTime={updateGameTime}
          resetTimeFlag={resetTimeFlag}
        />
      </div>

      <CardsGrid
        arrayCards={arrayCards}
        openedCards={openedCards}
        matched={matched}
        flipCard={flipCard}
        numRows={numRows}
        numCols={numCols}
      />

      {gameStatus === "finished" && (
        <div className="congrats-message">
          <h2>Поздравляем! Вы выиграли!</h2>
          <p className={style.time}>Время: {gameTime} секунд</p>
        </div>
      )}

      <RestartButton text="Начать снова" onClick={resetGame} />
      <RestartButton
        text="Перейти к статистике"
        onClick={() => navigate("/history")}
      />
    </div>
  );
}

export default Game;