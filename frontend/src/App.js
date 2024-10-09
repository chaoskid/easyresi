import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Page Imports
import Index from './pages/index';
import About from './pages/about';
import Login from './pages/login';
import Register from './pages/register';
import Questionnaire from './pages/questionnaire'; // Fixed typo from 'questionairre' to 'questionnaire'
import Dashboard from './pages/dashboard';
import Notfound from './pages/notfound';
import Statistics from './pages/statistics';
import Account from './pages/account';
import Settings from './pages/settings';
import DisplaySettings from './pages/displaysettings';

function App() {
    return (
        <Router>
            <div className="App">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/questionnaire" element={<Questionnaire />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/statistics" element={<Statistics />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/displaysettings" element={<DisplaySettings />} /> 
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Notfound />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;