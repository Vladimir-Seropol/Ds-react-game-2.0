import  { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'; // Используем createRoot для React 18
import './index.css'; // Импортируем стили
import { GameProvider } from './components/GameContext'; // Импортируем провайдер контекста
import { RouterProvider } from 'react-router-dom'; // Импортируем компоненты для маршрутизации
import router from './router'; // Импортируем настроенный роутер

// Создаём корневой элемент и рендерим приложение
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <GameProvider>
      <RouterProvider router={router} /> {/* Добавляем RouterProvider */}
    </GameProvider>
  </StrictMode>
);
