import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import { useEffect, useRef } from "react";
import { logout } from "./api/auth";
import Registration from "./components/Registration/Registration";
import MainPage from "./components/MainPage/MainPage";
import UserSettings from "./components/UserSettings/UserSettings";

const App = () => {
  const logoutCalled = useRef(false);

  useEffect(() => {
    if (!logoutCalled.current) {
      logout();
      logoutCalled.current = true;
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/mainpage" element={<MainPage />} />
      <Route path="/settings" element={<UserSettings />} />
    </Routes>
  );
};

export default App;
