import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Login';
import Register from './pages/Register';
import VerifyCode from './pages/account/VerifyCode';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account/register" element={<Register />} />
        <Route path="/account/verify-code" element={<VerifyCode />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
