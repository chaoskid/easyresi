import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Easy Resi</h1>
            <div className="links">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
                <a href="/questionairre">Questionairre</a>
            </div>
        </nav>
    );
}

export default Navbar;