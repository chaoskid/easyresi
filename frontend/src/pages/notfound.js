import { Link } from "react-router-dom";
import '../index.css';
import Navbar from '../components/Navbar';
import Footer from "../components/Footer";

const Notfound = () => {
    return (
    <>
    <Navbar />
        <div className="not-found">
        <h1><strong>Sorry!</strong></h1>
        <p>That page cannot be found.</p>
        <Link className="home-button" to="/">Back to Home Page</Link>
        </div>
    <Footer />
    </>
    );
}

export default Notfound;
