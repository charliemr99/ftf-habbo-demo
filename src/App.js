import React, { useState } from "react";
import Landing from "./components/Landing";
// import Profile from "./components/Profile";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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

      <RegisterModal />
    </div>
  );
}

function RegisterModal() {
  return (
    <>
      <div className="container-register-modal">
        <div className="inputs-register__inputs">
          <input
            type="text"
            name="inputEmail"
            id="inputEmail"
            placeholder="Email"
          />
          <input
            type="text"
            name="inputPassword"
            id="inputPassword"
            placeholder="Password"
          />
        </div>
        <div className="inputs-register__btn">
          <span>register!</span>
        </div>
      </div>
    </>
  );
}

export default App;
