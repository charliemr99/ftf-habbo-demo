import React, { useState } from "react";
import Landing from "./components/Landing";
// import Profile from "./components/Profile";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import iconClose from "./assets/icons/cancel.svg";
import "./App.css";

function App() {
  const [registerModal, setRegisterModal] = useState(false);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">
            <Landing
              registerModal={registerModal}
              setRegisterModal={setRegisterModal}
            />
          </Route>

          <Route path="/profile">{/* <Profile sesion={sesion} /> */}</Route>
        </Switch>
      </Router>
      {registerModal && <RegisterModal closeModal={setRegisterModal} />}
    </div>
  );
}

function RegisterModal({ closeModal }) {
  return (
    <>
      <div className="container-register-modal">
        <div className="inputs-register__inputs">
          <div className="close-modal">
            <img
              src={iconClose}
              alt="X"
              onClick={() => {
                closeModal(false);
              }}
            />
          </div>
          <div className="item-modal">
            <label htmlFor="inputEmail">Email</label>
            <input type="text" name="inputEmail" id="inputEmail" />
          </div>
          <div className="item-modal">
            <label htmlFor="inputPassword">Password</label>
            <input type="Password" name="inputPassword" id="inputPassword" />
          </div>
        </div>
        <div className="inputs-register__btn">
          <span>register!</span>
        </div>
      </div>
    </>
  );
}

export default App;
