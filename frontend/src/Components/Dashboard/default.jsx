import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import Chart from "chart.js";
import { contract_address, contract_abi } from "../../Consts/constants";

export const Default = () => {
  const [votedVoterCount, setvotedVoterCount] = useState(0);
  const [voterCount, setvoterCount] = useState(0);
  const getContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contract_address,
      contract_abi,
      signer
    );
    return contract;
  };
  const getVotenVoter = async () => {
    const contract = await getContract();
    const vC = await contract.getVotedVoterCount();
    const RVC = await contract.getRegisteredVoterCount();
    setvotedVoterCount(vC.toNumber());
    setvoterCount(RVC.toNumber());
  };
  useEffect(() => {
    getVotenVoter();
  }, []);
  return (
    <>
      {/* <div>
        {votedVoterCount} voters voted out of {voterCount} voters.
      </div> */}
      <div className="VoteStats">
        <div>
          {" "}
          <h2>Voter Turnout</h2>
        </div>
        <PieChart votedVoterCount={votedVoterCount} voterCount={voterCount} />
      </div>
    </>
  );
};

const PieChart = (props) => {
  // const [registeredVoters, setRegisteredVoters] = useState(props.voterCount);
  // const [peopleVoted, setPeopleVoted] = useState(props.votedVoterCount);
  const registeredVoters = props.voterCount;
  const peopleVoted = props.votedVoterCount;
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  console.log("Voters" + registeredVoters);
  useEffect(() => {
    if (chartContainerRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(chartContainerRef.current, {
        type: "pie",
        data: {
          labels: ["People Voted", "People Not Voted"],
          datasets: [
            {
              data: [peopleVoted, registeredVoters - peopleVoted],
              backgroundColor: ["#36A2EB", "#FF6384"],
              hoverBackgroundColor: ["#36A2EB", "#FF6384"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.parsed;
                  const percentage = ((value / registeredVoters) * 100).toFixed(
                    2
                  );
                  return `${value} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    }
  }, [registeredVoters, peopleVoted]);

  const votedPercentage = ((peopleVoted / registeredVoters) * 100).toFixed(2);
  const notVotedPercentage = (100 - votedPercentage).toFixed(2);

  return (
    <div>
      <div style={{ width: "300px", height: "300px" }}>
        <canvas ref={chartContainerRef} />
      </div>
      {/* <div>
        <label htmlFor="registeredVoters">Registered Voters: </label>
        <input
          type="number"
          id="registeredVoters"
          value={registeredVoters}
          onChange={handleRegisteredVotersChange}
        />
      </div> */}
      {/* <div>
        <label htmlFor="peopleVoted">People Voted: </label>
        <input
          type="number"
          id="peopleVoted"
          value={peopleVoted}
          onChange={handlePeopleVotedChange}
        />
      </div> */}
      <div style={{ marginTop: "20px" }}>
        <p>
          People Voted: {peopleVoted} ({votedPercentage}%)
        </p>
        <p>
          People Not Voted: {registeredVoters - peopleVoted} (
          {notVotedPercentage}%)
        </p>
      </div>
    </div>
  );
};
