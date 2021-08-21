import React from "react";

import iconHome from "../../assets/icons/home.svg";
import iconMoney from "../../assets/icons/money.svg";
import iconInfo from "../../assets/icons/informacion.svg";
import iconCommunity from "../../assets/icons/community.svg";

import "./Nav.css";

function Nav() {
  return (
    <section className="container-modal">
      <div className="container-modal__nav">
        <img src={iconHome} alt="Icono de una casa" />
        <span>HOME</span>
      </div>
      <div className="container-modal__nav">
        <img src={iconCommunity} alt="Icono de un grupo de personas" />
        <span>COMMUNITY</span>
      </div>
      <div className="container-modal__nav">
        <img src={iconMoney} alt="Icono de dinero" />
        <span>SHOP</span>
      </div>
      <div className="container-modal__nav">
        <img src={iconInfo} alt="Icono de información" />
        <span>PLAYING HABBO</span>
      </div>
    </section>
  );
}

export default Nav;
