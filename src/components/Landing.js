import React from "react";
import Header from "./Header";
import Nav from "./Nav/Nav";
import Footer from "./Footer";
import News from "./News/News";

const Landing = ({ registerModal, setRegisterModal }) => {
  return (
    <>
      <Header
        registerModal={registerModal}
        setRegisterModal={setRegisterModal}
      />
      <Nav />
      <News />
      <Footer />
    </>
  );
};

export default Landing;
