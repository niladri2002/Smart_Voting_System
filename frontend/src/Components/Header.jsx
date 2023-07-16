import { ethers } from "ethers";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  contract_address,
  contract_abi,
  BaseUrl,
} from "../Consts/constants.js";
axios.defaults.baseURL = BaseUrl;
export const Header = (props) => {
  const [isAdmin, setisAdmin] = useState(false);

  const [duration, setduration] = useState(0);
  const [showStartVote, setshowStartVote] = useState(true);
  useEffect(() => {
    const check = async () => {
      const checkadmin = await props.isAdmin();
      setisAdmin(checkadmin);
      console.log("is Admin" + checkadmin);
    };
    check();
  }, []);
  const handleUpdateDuration = (duration) => {
    const updatedDuration = duration;
    if (!isNaN(updatedDuration) && updatedDuration >= 0) {
      axios
        .post("/set-duration", {
          duration: updatedDuration,
        })
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.error("Invalid duration!");
    }
  };

  const startVote = async (duration) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contract_address,
      contract_abi,
      signer
    ).connect(signer);

    const transaction = await contract.start(duration);
    const transactionHash = transaction.hash;

    const receipt = await provider.waitForTransaction(transactionHash);
    handleUpdateDuration(duration);
    setshowStartVote(false);
  };

  return (
    <div className="header">
      <div>
        <TimerComponent
          setshowStartVote={setshowStartVote}
          showStartVote={showStartVote}
        />
      </div>{" "}
      {showStartVote && isAdmin ? (
        <div className="TimerUpdate">
          <input
            placeholder="Enter duration in minutes"
            type="text"
            onChange={(e) => {
              setduration(e.target.value);
            }}
          />{" "}
          <button
            onClick={() => {
              const updateTime = async () => {
                await startVote(duration);
              };
              updateTime();
            }}
          >
            Start Vote
          </button>
        </div>
      ) : (
        <></>
      )}{" "}
    </div>
  );
};
const TimerComponent = (props) => {
  const [remainingTime, setRemainingTime] = useState(0);
  useEffect(() => {
    axios
      .get("/get-remaining-time")
      .then((response) => {
        const { remainingTime } = response.data;

        if (remainingTime > 0) props.setshowStartVote(false);
        console.log("remaining", remainingTime);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  useEffect(() => {
    axios
      .get("/get-remaining-time")
      .then((response) => {
        const { remainingTime } = response.data;
        setRemainingTime(remainingTime);
        console.log("remaining", remainingTime);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [props.showStartVote]);
  useEffect(() => {
    console.log(remainingTime);
    if (remainingTime <= 0) {
      props.setshowStartVote(true);
      return;
    }
    const interval = setInterval(() => {
      setRemainingTime(remainingTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  const formatRemainingTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return <div>Remaining Time: {formatRemainingTime(remainingTime)}</div>;
};
