import React from "react";
import { SignInButton } from "../components/signin-button";

const Home = () => {
  return (
    <div className="home-page">
      <h1>Home</h1>
      <SignInButton className="signin-button" />
    </div>
  );
};

export default Home;
