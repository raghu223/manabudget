import React from 'react';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';
import Header from './components/common/Header';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <ToastContainer position="top-center" />
      <div className="container">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
