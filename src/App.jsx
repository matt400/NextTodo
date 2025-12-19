import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
    </Routes>
  );
};

export default App;

