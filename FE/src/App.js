import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./components/MyRoutes/MyRoutes";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <MyRoutes/>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
