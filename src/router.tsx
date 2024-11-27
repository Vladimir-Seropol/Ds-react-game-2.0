// src/router.tsx

import { createBrowserRouter } from "react-router-dom";
import Game from "./pages/Game";
import History from "./pages/History";




const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "/", element: <Game /> },
      { path: "history", element: <History /> },
    ]
  }
]);

export default router;
