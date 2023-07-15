import React from "react";
import Navbar from "./Navbar";
import Vote from "../assets/Vote.png";
import Fox from "../assets/fox.png";
import "./login.css";

export const Login = (props) => {
  console.log("ShowNAM " + props.ShowNotAuthorized);
  return (
    <>
      <Navbar />

      <section className="background firstSection">
        <div className="heading">
          <h1 className="animated-text">
            <span>W</span>
            <span>e</span>
            <span>l</span>
            <span>c</span>
            <span>o</span>
            <span>m</span>
            <span>e</span>
            <span className="space"></span>
            <span>t</span>
            <span>o</span>
            <span className="space"></span>
            <span>S</span>
            <span>m</span>
            <span>a</span>
            <span>r</span>
            <span>t</span>
            <span className="space"></span>
            <span>V</span>
            <span>o</span>
            <span>t</span>
            <span>i</span>
            <span>n</span>
            <span>g</span>
            <span className="space"></span>
            <span>S</span>
            <span>y</span>
            <span>s</span>
            <span>t</span>
            <span>e</span>
            <span>m</span>
          </h1>
        </div>
        <div className="box-main">
          <div className="firstHalf">
            <p className="text-big">The future of Voting System is Here</p>
            <p className="text-small">
              Introducing our revolutionary smart voting system web app,
              bringing the power of decentralized democracy to your fingertips.
              With our platform, you can vote securely and conveniently from the
              comfort of your own home, ensuring your voice is heard in the most
              transparent and reliable manner. Experience the future of
              elections as we redefine the voting process, leveraging blockchain
              technology to uphold the integrity and accessibility of our
              democratic systems. Embrace digital democracy today and be a part
              of shaping the future of your nation.
            </p>
            <div className="below-firsthalf">
              <img src={Fox} alt="Metamask"></img>
              <div className="buttons">
                <button className="btn btn-dark" onClick={props.connectAccount}>
                  Login Metamask
                </button>
                <button className="btn btn-dark">watch Video</button>
              </div>
            </div>
            <div className="NotAuthorized">
              {props.ShowNotAuthorized ? <p>You are not authorized</p> : <></>}
            </div>
          </div>
          <div className="secondHalf">
            <img src={Vote} alt="Picture"></img>
          </div>
        </div>
      </section>

      {/* <div className="loginContainer">
      
      <button className="loginButton" onClick={props.connectAccount}>
        Login Metamask
      </button>
      <div>
        {" "}
        {props.ShowNotAuthorized ? <p>You are not authorized</p> : <></>}
      </div>
    </div> */}
    </>
  );
};
