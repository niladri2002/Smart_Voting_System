import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contract_address, contract_abi } from "./Consts/constants.js";
import { Login } from "./Components/Login.jsx";
import { AfterLogin } from "./Components/AfterLogin.jsx";

import "./App.css";

function App() {
  const [Account, setAccount] = useState(null);
  const [IsConnected, setIsConnected] = useState(false);
  const [Candidates, setCandidates] = useState([]);
  const [CanVote, SetCanvote] = useState(false);
  const [voted, Setvoted] = useState(false);
  const [aadhar, SetAadhar] = useState("");
  const [RemainingTime, setRemainingTime] = useState(0);
  const [ShowNotAuthorized, setShowNotAuthorized] = useState(false);

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const address = await signer.getAddress();
        setAccount(address);
        if (CanVote) setIsConnected(true);
        else {
          setShowNotAuthorized(true);
          console.log("showNA" + ShowNotAuthorized);
          return;
        }

        console.log("Metamask Connected : " + address);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser");
    }
  }

  const canVote = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      contract_address,
      contract_abi,
      signer
    );
    const address = await signer.getAddress();
    const voter = await contract.getVoters(address);
    SetCanvote(voter.authorized);
    console.log("VoterAadhar", voter.aadhar);
    SetAadhar(voter.aadhar);
    console.log("Voted " + voter.voted, ",Authorized " + voter.authorized);
    Setvoted(voter.voted);
  };

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

  const vote = async (index) => {
    const contract = await getContract();
    await contract.Vote(index);
    Setvoted(true);
    await getCandidates();
  };

  const authorize = async (Address, name, Aadhar) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const addressOfCurrentUser = await signer.getAddress();
    const contract = new ethers.Contract(
      contract_address,
      contract_abi,
      signer
    );

    const adminAdd = await contract.admin();

    console.log("Admin" + adminAdd);
    if (addressOfCurrentUser != adminAdd) {
      alert("You are not admin");
      return;
    }

    await contract.Authorize(Address, name, Aadhar);
  };

  const getCandidates = async () => {
    const contract = await getContract();

    const candidates = await contract.getCandidates();
    console.log(candidates);
    const formatedCandidate = candidates.map((candidate, ind) => {
      return {
        Name: candidate[0],
        VoteCount: candidate[1].toNumber(),
      };
    });
    console.log(formatedCandidate);
    console.log("dgdhgd");
    setCandidates(formatedCandidate);
  };
  const isAdmin = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const addressOfCurrentUser = await signer.getAddress();
    const contract = new ethers.Contract(
      contract_address,
      contract_abi,
      signer
    );

    const adminAdd = await contract.admin();
    return adminAdd == addressOfCurrentUser;
  };
  useEffect(() => {
    canVote();
    getCandidates();
  }, []);

  const handelAccountChange = (account) => {
    canVote();
    setAccount(account[0]);
  };
  console.log(IsConnected);
  window.ethereum.on("accountsChanged", handelAccountChange);
  return (
    <>
      {!IsConnected ? (
        <Login
          connectAccount={connectToMetamask}
          ShowNotAuthorized={ShowNotAuthorized}
        />
      ) : (
        <AfterLogin
          account={Account}
          getCandidates={getCandidates}
          Candidates={Candidates}
          authorize={authorize}
          CanVote={CanVote}
          vote={vote}
          voted={voted}
          aadhar={aadhar}
          RemainingTime={RemainingTime}
          setIsConnected={setIsConnected}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
}
export default App;
