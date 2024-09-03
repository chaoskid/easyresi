import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Index  from './pages/index';
import About  from './pages/about';
import Login from './pages/login';
import Register from './pages/register';
import Questionairre from './pages/questionairre';

import Layout from './components/Layout';
import Navbar from './components/Navbar';


function App() {
    return (
        <Router>
            <div className="App">
            <Navbar />
                <div className="content">
                    
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/questionairre" element={<Questionairre />} />

                    </Routes>
                </div>
            </div>
        </Router>
      
  );
}

export default App;
