import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../index.css';
import CardsGrid from "../../components/CardsGrid";
import Moves from "../../components/Moves";
import RestartButton from "../../components/Button";
import Timer from "../../components/Timer";
import { useGameContext } from "../../components/GameContext";
import style  from './style.module.css';

// Генерация массива карт для игры (по 2 одинаковые карты для каждой пары)
const icons = Array.from({ length: 26 }, (_, index) => 
  `/images/${(index + 1).toString().padStart(2, '0')}.jpg`
);

export interface CardType {
  id: number;
  img: string;
}

function Game() {
  const [arrayCards, setArrayCards] = useState<CardType[]>([]); 
  const [openedCards, setOpenedCards] = useState<number[]>([]); 
  const [matched, setMatched] = useState<number[]>([]); 
  const [moves, setMoves] = useState(0); 
  const [isGameActive, setIsGameActive] = useState(false); 
  const [hasStarted, setHasStarted] = useState(false); 
  const [gameTime, setGameTime] = useState(0); 
  const [nonMatchedCards, setNonMatchedCards] = useState<number[]>([]); // Состояние не совпавших карт
  const [cardOpenCounts, setCardOpenCounts] = useState<{ [key: number]: number }>({});

  const [numRows, setNumRows] = useState(2); 
  const [numCols, setNumCols] = useState(3); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [resetTimeFlag, setResetTimeFlag] = useState(false);
  const { setStats } = useGameContext();
  const navigate = useNavigate(); 

  const generateCardPairs = (numPairs: number) => {
    const cards = [];
    for (let i = 0; i < numPairs; i++) {
      cards.push({ id: i + 1, img: icons[i % icons.length] });
      cards.push({ id: i + 1, img: icons[i % icons.length] });
    }
    return cards;
  };

  const shuffleCards = (array: CardType[]): CardType[] => {
    let shuffleIndex = array.length;
    let randomIndex: number;
    let tempValue: CardType;

    while (shuffleIndex !== 0) {
      randomIndex = Math.floor(Math.random() * shuffleIndex);
      shuffleIndex -= 1;
      tempValue = array[shuffleIndex];
      array[shuffleIndex] = array[randomIndex];
      array[randomIndex] = tempValue;
    }
    return array;
  };

  const resetGame = () => {
    const totalCards = numRows * numCols;
    const numPairs = totalCards / 2; 
    const availableCards = generateCardPairs(numPairs); 
    setArrayCards(shuffleCards(availableCards)); 
    setOpenedCards([]); 
    setMatched([]); 
    setNonMatchedCards([]);
    setCardOpenCounts({});
    setMoves(0); 
    setIsGameActive(false); 
    setHasStarted(false); 
    setGameTime(0); 
    setResetTimeFlag(true);
  };

  useEffect(() => {
    resetGame();
  }, [numRows, numCols]);

  useEffect(() => {
    if (matched.length === arrayCards.length / 2) {  
      setIsGameActive(false);
      const newStats = { moves, gameTime, numRows, numCols };
      setStats(newStats); 
    }
  }, [matched, arrayCards, moves, gameTime, setStats, numRows, numCols]);

  useEffect(() => {
    if (resetTimeFlag) {
      setResetTimeFlag(false);  
    }
  }, [resetTimeFlag]);

  const flipCard = (index: number): void => {
    if (openedCards.includes(index) || matched.includes(arrayCards[index].id)) {
      return;
    }
  
    // Увеличиваем счетчик открытий карты
    setCardOpenCounts((prevCounts) => {
      const newCounts = { ...prevCounts };
      newCounts[index] = (newCounts[index] || 0) + 1;
      return newCounts;
    });
  
    if (!hasStarted) {
      setHasStarted(true);
      setIsGameActive(true);
    }
  
    setOpenedCards((opened) => [...opened, index]);
    setMoves((prevMove) => prevMove + 1);
  };
  

  useEffect(() => {
    if (openedCards.length < 2) return;

  const [firstIndex, secondIndex] = openedCards;
  const firstMatched = arrayCards[firstIndex];
  const secondMatched = arrayCards[secondIndex];

  if (firstMatched.id === secondMatched.id) {
    setMatched((prevMatched) => [...prevMatched, firstMatched.id]);
  } else {
    // Если карты не совпали, проверяем, сколько раз они были открыты
    if (cardOpenCounts[firstIndex] >= 2) {
      setNonMatchedCards((prev) => [...prev, firstIndex]);
    }
    if (cardOpenCounts[secondIndex] >= 2) {
      setNonMatchedCards((prev) => [...prev, secondIndex]);
    }
  }
  
    setTimeout(() => {
      setOpenedCards([]);  // Закрываем карты после 1 секунды
    }, 1000);
  }, [openedCards, arrayCards]);

  const areAllCardsOpened = matched.length === arrayCards.length / 2;

  const updateGameTime = (time: number) => {
    setGameTime(time);
  };

  const handleFieldSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    switch (value) {
      case '2x3':
        setNumRows(2);
        setNumCols(3);
        break;
      case '3x4':
        setNumRows(3);
        setNumCols(4);
        break;
      case '4x4':
        setNumRows(4);
        setNumCols(4);
        break;
      case '4x5':
        setNumRows(4);
        setNumCols(5);
        break;
      case '4x6':
        setNumRows(4);
        setNumCols(6);
        break;
      default:
        break;
    }
    closeModal(); 
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    const modalOverlay: any = document.querySelector(`.${style.modal_overlay}`);
    modalOverlay.classList.remove(style.show);
    
    setTimeout(() => {
        setIsModalOpen(false);
    }, 300); 
};

  return (
    <div className="container">
       <div className={style.settings_dlock}>
    <div className={style.settings_icon}>
        
        <RestartButton text="⚙️" onClick={openModal} style={{margin: "0", position: "absolute", top: "0", right: "0"}}/>
    </div>

    {isModalOpen && (
        <div className={`${style.modal_overlay} ${isModalOpen ? style.show : ''}`} onClick={closeModal}>
            <div className={style.congrats_content} onClick={(e) => e.stopPropagation()}>
                <h2>Выберите размер поля:</h2>
                <select onChange={handleFieldSizeChange}>
                    <option value="2x3">2x3</option>
                    <option value="3x4">3x4</option>
                    <option value="4x4">4x4</option>
                    <option value="4x5">4x5</option>
                    <option value="4x6">4x6</option>
                </select>
                <RestartButton text="Закрыть" onClick={closeModal} style={{fontSize: "12px"}}/>
            </div>
        </div>
    )}
</div>

      <div className="counters">
        <Moves moves={moves} />
        <Timer
          isActive={isGameActive && hasStarted}
          areAllCardsOpened={areAllCardsOpened}
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
        nonMatchedCards={nonMatchedCards} 
      />

      {matched.length === arrayCards.length / 2 && (
        <div className="congrats-message">
          <h2>Поздравляем! Вы выиграли!</h2>
          <p className={style.time}>Время: {gameTime} секунд</p>
        </div>
      )}

      <RestartButton text="Начать снова" onClick={resetGame} />
      <RestartButton text="Перейти к статистике" onClick={() => navigate('/history')} />
    </div>
  );
}

export default Game;
