import React from "react";

// Assets
import iconFacebook from "../assets/icons/facebook.svg";

// Styles
import "./variables.css";
import "./header.css";

export default function Header({ setRegisterModal }) {
  return (
    <div className="header-container">
      <div className="header-container__login">
        <div className="inputs-login">
          <div className="inputs-login__inputs">
            <input
              type="text"
              name="inputEmail"
              id="inputEmail"
              placeholder="Email"
            />
            <input
              type="Password"
              name="inputPassword"
              id="inputPassword"
              placeholder="Password"
            />
          </div>
          <div className="inputs-login__btn">
            <span>let´s go!</span>
          </div>
        </div>
        <div className="social-network">
          <div className="social-network__icon">
            <img src={iconFacebook} alt="Icono de facebook" />
          </div>
          <div className="social-network__text">
            <span>Login with Facebook so you can play with your friends.</span>
            <span>More ways to login</span>
          </div>
        </div>
      </div>
      <div className="header-container__info">
        <div className="nautilus"></div>
        <div className="info">
          <div className="container-info">
            <div className="container-info__title">
              <h2>MAKE FRIENDS & CHAT WITH MILLIONS IN A VIRTUAL WORLD</h2>
            </div>
            <div className="container-info__button">
              <span
                onClick={() => {
                  setRegisterModal(true);
                }}
              >
                JOIN FOR FREE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
