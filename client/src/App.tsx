import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { autoLogin } from './actions/authActions';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AlertNotification from "./components/AlertNotification";
import { useAppSelector } from './store';
import Loading from './components/Loading';

function App() {
  const dispatch = useDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(autoLogin());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Conditional redirection based on auth status */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
      <AlertNotification />
      {/* Display error if exists */}
      {error && <div className="error">{error}</div>}
    </>
  );
}

export default App;
