import React from "react";
import sucess from "./404-tick.png";
import "./Modal.css";

export default function Modal({ showModal, closeModal }) {
    return (
        <div className={`popup ${showModal ? 'open-popup' : ''}`} id="popup">
            {showModal && (
                <div className="container" onClick={closeModal}>
                    <img src={sucess} alt="Success" />
                    <h2>Success!</h2>
                    <p>User Registered Successfully</p>
                    <button type="button" onClick={closeModal}>Ok</button>
                </div>
            )}
        </div>
    );
}