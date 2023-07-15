import React, { useState } from "react";
import Register from "./Register";
export const Authorize = (props) => {
  const [address, setaddress] = useState("");
  const [name, setname] = useState("");

  return (
    <div className="form">
      <div>
        <Register />
      </div>
      <div className="keys">Enter public address :</div>{" "}
      <div className="values">
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setaddress(e.target.value);
          }}
        />
        <div className="keys">Enter name :</div>{" "}
        <div className="values">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setname(e.target.value);
            }}
          />
          <button
            onClick={() => {
              props.authorize(address, name);
            }}
          >
            {" "}
            Authorize{" "}
          </button>
        </div>
      </div>
    </div>
  );
};
