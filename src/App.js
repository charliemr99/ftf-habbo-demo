import React, { useState } from "react";
import Landing from "./components/Landing";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

function App() {
  const [sesion, setSesion] = useState(false);
  const [modalLoginStatus, setModalLoginStatus] = useState(false);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">
            <Landing
              sesion={sesion}
              userPic={userPic}
              loginModalShow={loginModalShow}
              setLoginModalShow={setLoginModalShow}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
