
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

