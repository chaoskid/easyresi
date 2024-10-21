/*import React from 'react';

const Popup = ({ message, onClose }) => {
    if (!message) return null; // Don't render if there's no message

    return (
        <div className="popup">
            <span className="popup-message">{message}</span>
            <button className="popup-close" onClick={onClose}>×</button>
        </div>
    );
}

export default Popup;
*/

import React, { useEffect } from 'react';

const Popup = ({ error, onClose }) => {
    useEffect(() => {
        if (error) {
            // Auto-close the toast after 4 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer); // Clear timeout if component unmounts
        }
    }, [error, onClose]);

    if (!error) return null; // Don't render if there's no error

    return (
        <div className="popup">
            <span>{error}</span>
            <button className="popup-close" onClick={onClose}>×</button>
        </div>
    );
}

export default Popup;