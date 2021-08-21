import React from "react";
import { APP } from "../js/nautilus/app";

// Assets
import iconFacebook from "../assets/icons/facebook.svg";
import habboLogo from "../assets/icons/habbo_logo.svg";
import landingRoom from "../assets/landingRoom.json";

// Styles
import "./Variables.css";
import "./Header.css";

export default function Header({ setRegisterModal }) {
  const [resize, setResize] = React.useState(false);
  let player = null;
  const roomContainer = React.useRef();

  function onWindowResize(event) {
    if (window.screen.width > 320 && window.screen.width < 768) {
      setResize(true);
    }
    resize3DRoom();
  }

  function setUp3DRoom() {
    player = new APP.Player();
    player.load(landingRoom, {});
    player.setSize(
      roomContainer.current.clientWidth,
      roomContainer.current.clientHeight
    );
    player.play({ data: {} });

    roomContainer.current.appendChild(player.dom);
  }

  function resize3DRoom() {
    if (player) {
      console.log("player,", player);

      player.setSize(
        roomContainer.current.clientWidth,
        roomContainer.current.clientHeight
      );

      player.getCamera().updateProjectionMatrix();
    }
    setResize(false);
  }

  function remove3DRoom() {
    if (player) {
      roomContainer.current.removeChild(player.dom);
      player.stop();
    }
  }

  React.useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    setUp3DRoom();
    return () => {
      window.removeEventListener("resize", onWindowResize);
      remove3DRoom();
    };
  }, [resize]);

  React.useEffect(() => {
    setResize(true);
    setTimeout(() => {
      setResize(false);
    }, 1000);
  }, []);

  return (
    <div className="header-container">
      <div className="header-container__login">
        <div className="inputs-login__responsive">
          <span>Login</span>
        </div>
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
      <img className="habbo-logo" src={habboLogo} alt="Habbo Logo" />
      <div className="header-container__info">
        <div
          className="nautilus"
          ref={roomContainer}
          style={{ width: "50vw", minHeight: "300px" }}
        ></div>
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
