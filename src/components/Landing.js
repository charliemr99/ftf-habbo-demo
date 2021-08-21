import React from "react";
import Header from "./Header";
import Nav from "./Nav/Nav";
import Footer from "./Footer";

const Landing = ({ registerModal, setRegisterModal }) => {
  return (
    <>
      <Header
        registerModal={registerModal}
        setRegisterModal={setRegisterModal}
      />
      <Nav />
      <Footer />
    </>
  );
};

export default Landing;
