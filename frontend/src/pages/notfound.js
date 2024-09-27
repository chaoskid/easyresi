import { Link } from "react-router-dom";
import '../index.css';

const Notfound = () => {
    return (
        <div className="not-found">
            <h1><strong>Sorry!</strong></h1>
            <p>Sorry, that page cannot be found.</p>
            <Link className="home-button" to="/">Back to Home Page</Link>
        </div>
    );
}

export default Notfound;
