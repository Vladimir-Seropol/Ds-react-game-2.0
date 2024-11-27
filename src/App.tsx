
import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './router'; 
import Game from './pages/Game'; 
import History from './pages/History'; 


function App() {
 

  return (
    <div className="container">
      <RouterProvider router={router} /> 
      <History  />
      <Game />
    </div>
  );
}

export default App;





























// import { useState, useEffect } from "react";
// import "./App.css";
// import icon1 from "../public/images/01.jpg";
// import icon2 from "../public/images/02.jpg";
// import icon3 from "../public/images/03.jpg";
// import icon4 from "../public/images/04.jpg";
// import icon5 from "../public/images/05.jpg";
// import icon6 from "../public/images/06.jpg";
// import CardsGrid from "./components/CardsGrid";
// import Moves from "./components/Moves";
// import RestartButton from "./components/Button";
// import Timer from "./components/Timer";
// import GameStats from "./components/GameStats"; // Новый компонент для статистики

// export interface CardType {
//   id: number;
//   img: string;
// }

// const initialArrayCards = [
//   { id: 1, img: icon1 },
//   { id: 2, img: icon2 },
//   { id: 3, img: icon3 },
//   { id: 4, img: icon4 },
//   { id: 5, img: icon5 },
//   { id: 6, img: icon6 },
// ];

// const pairOfArrayCards = [...initialArrayCards, ...initialArrayCards];

// function App() {
//   const [arrayCards, setArrayCards] = useState<CardType[]>([]);
//   const [openedCards, setOpenedCards] = useState<number[]>([]);
//   const [matched, setMatched] = useState<number[]>([]);
//   const [moves, setMoves] = useState(0);
//   const [isGameActive, setIsGameActive] = useState(true); // Флаг активности игры
//   const [hasStarted, setHasStarted] = useState(false); // Флаг для отслеживания первого клика
//   const [showCongrats, setShowCongrats] = useState(false); // Флаг для показа поздравления
//   const [gameTime, setGameTime] = useState(0); // Время игры

//   // Функция перемешивания карточек
//   const shuffleCards = (array: CardType[]): CardType[] => {
//     let shuffleIndex = array.length;
//     let randomIndex: number;
//     let tempValue: CardType;

//     while (shuffleIndex !== 0) {
//       randomIndex = Math.floor(Math.random() * shuffleIndex);
//       shuffleIndex -= 1;
//       tempValue = array[shuffleIndex];
//       array[shuffleIndex] = array[randomIndex];
//       array[randomIndex] = tempValue;
//     }
//     return array;
//   };

//   useEffect(() => {
//     // При монтировании компонента сбрасываем все состояние, как при перезапуске
//     resetGame();
//   }, []); // Пустой массив зависимостей, чтобы сработало только при загрузке страницы

//   // Функция сброса состояния игры
//   const resetGame = () => {
//     setArrayCards(shuffleCards(pairOfArrayCards));
//     setOpenedCards([]);
//     setMatched([]);
//     setMoves(0);
//     setIsGameActive(true);
//     setHasStarted(false);
//     setShowCongrats(false);
//     setGameTime(0);
//   };

//   // Функция переворота карточки
//   const flipCard = (index: number): void => {
//     // Игнорируем клик, если карточка уже открыта или совпала
//     if (openedCards.includes(index) || matched.includes(arrayCards[index].id)) {
//       return;
//     }

//     // Устанавливаем, что игра началась при первом клике
//     if (!hasStarted) {
//       setHasStarted(true); // Первый клик
//     }

//     setOpenedCards((opened) => [...opened, index]);
//     setMoves((prevMove) => prevMove + 1);
//   };

//   // Логика для проверки совпадений
//   useEffect(() => {
//     if (openedCards.length < 2) return;

//     const [firstIndex, secondIndex] = openedCards;
//     const firstMatched = arrayCards[firstIndex];
//     const secondMatched = arrayCards[secondIndex];

//     if (firstMatched.id === secondMatched.id) {
//       setMatched((prevMatched) => [...prevMatched, firstMatched.id]);
//     }

//     // Закрыть карточки после задержки (1 секунда)
//     setTimeout(() => setOpenedCards([]), 1000);
//   }, [openedCards, arrayCards, matched]);

//   // Проверяем, закончилась ли игра (все карты совпали)
//   useEffect(() => {
//     if (matched.length === arrayCards.length / 2) {
//       setIsGameActive(false); // Если все карточки совпали, игра завершена
//       setShowCongrats(true); // Показываем поздравление

//       // Сохраняем статистику в localStorage
//       const stats = { moves, gameTime };
//       localStorage.setItem("gameStats", JSON.stringify(stats));
//     }
//   }, [matched, arrayCards, moves, gameTime]);

//   // Проверяем, что все карты совпали
//   const areAllCardsOpened = matched.length === arrayCards.length / 2; // Все карты совпали

//   return (
//     <div className="container">
//       <Moves moves={moves} />
//       <Timer isActive={isGameActive && hasStarted} areAllCardsOpened={areAllCardsOpened} setGameTime={setGameTime} /> {/* Таймер активируется только после первого клика */}
//       <CardsGrid
//         arrayCards={arrayCards}
//         openedCards={openedCards}
//         matched={matched}
//         flipCard={flipCard}
//       />
//       {showCongrats && (
//         <div className="congrats-message">
//           <h2>Поздравляем! Вы выиграли!</h2>
//           <p>Время: <Timer isActive={false} areAllCardsOpened={true} setGameTime={setGameTime} /> {/* Мы передаем isActive в false, чтобы таймер не обновлялся, когда игра завершена */}</p>
//         </div>
//       )}
//       <RestartButton onRestart={resetGame} />
//       <GameStats /> {/* Компонент для отображения статистики */}
//     </div>
//   );
// }

// export default App;

