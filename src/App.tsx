import ChessboardPanel from "./ChessboardPanel";
import Sidebar from "./Sidebar";
import "./App.css";

const App = () => {
  return (
    <div className="container">
      <ChessboardPanel />
      <Sidebar />
    </div>
  );
};

export default App;
