import  { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css'; 
import { GameProvider } from './components/GameContext'; 
import { RouterProvider } from 'react-router-dom'; 
import router from './router'; 


const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <GameProvider>
      <RouterProvider router={router} /> 
    </GameProvider>
  </StrictMode>
);
