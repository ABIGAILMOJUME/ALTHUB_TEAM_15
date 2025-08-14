import "./App.css";
import { Outlet } from "react-router-dom";
import { PiCopyrightThin } from "react-icons/pi";

export default function App() {
  return (
  <div className="app-container">
    <div className="main-content">
      <Outlet />
    </div>
      <footer>
        <p><PiCopyrightThin />BinIt {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
