import React from "react";
import image from "../assets/election.png";
import "./nav.css";

function Navbar() {
  return (
    <div>
      <nav className="navbar backgroun">
        <div className="navlist">
          <div className="logo">
            <img src={image} alt="Picture"></img>
            <h1>E-CHOICE</h1>
          </div>
        </div>
        <div class="rightNav">
          <li>About</li>
          <li>Process to Vote</li>
          <li>News</li>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
