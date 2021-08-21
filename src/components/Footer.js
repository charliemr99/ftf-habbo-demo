import React from "react";
import iconVr from "../assets/icons/virtual-reality.svg";
import iconFb from "../assets/icons/facebook.svg";
import iconIg from "../assets/icons/instagram.svg";
import iconTw from "../assets/icons/twitter.svg";

import "./Footer.css";

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-container__social-links">
        <img src={iconFb} alt="Icono de Facebook" />
        <img src={iconIg} alt="Icono de Instagram" />
        <img src={iconTw} alt="Icono de Twitter" />
      </div>
      <div className="footer-container__footer-links">
        <span>
          Customer Support Helpdesk / Safety / For parents / Terms of Service &
          Privacy Policy / advertising@sulake.com / Cookie Policy / Cookie
          Preferences
        </span>
        <span>© 2021 HabboVR. Lorem ipsum dolorem bla bla bla.</span>
      </div>
      <div className="footer-container__company-logo">
        <img src={iconVr} alt="Icono de Realidad Virtual" />
      </div>
    </div>
  );
}
