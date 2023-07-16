import React, { useState } from "react";
import image from "../assets/election.png";
import logout from "../assets/logout.png";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import Register from "./Dashboard/Register";
import { Vote } from "./Dashboard/Vote";
import { Result } from "./Dashboard/Result";
import { Default } from "./Dashboard/default";
import { useNavigate } from "react-router-dom";
import "./Dashboard/dashboard.css";

import { Header } from "./Header";

export const AfterLogin = (props) => {
  return (
    <div className="loginContainer">
      <BrowserRouter
        basename={import.meta.env.DEV ? "/" : "/Smart-Voting-system/"}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Root
                account={props.account}
                setIsConnected={props.setIsConnected}
                RemainingTime={props.RemainingTime}
                startVote={props.startVote}
                updateRemainingTime={props.updateRemainingTime}
                isAdmin={props.isAdmin}
              />
            }
          >
            <Route index element={<Default />} />
            <Route
              path="/Auth"
              element={
                <Register isAdmin={props.isAdmin} authorize={props.authorize} />
              }
            />

            <Route
              path="/Vote"
              element={
                <Vote
                  getCandidates={props.getCandidates}
                  Candidates={props.Candidates}
                  CanVote={props.CanVote}
                  vote={props.vote}
                  voted={props.voted}
                  aadhar={props.aadhar}
                />
              }
            />
            <Route
              path="/getResult"
              element={<Result Candidates={props.Candidates} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const Root = (props) => {
  const nav = useNavigate();

  return (
    <>
      <div className="container">
        <div className="sidepanel">
          <div className="top">
            <img src={image} alt="Picture"></img>
            <h2>E-CHOICE</h2>
          </div>
          <div className="middle">
            <div className="options">
              <NavLink to="/Auth">
                <span class="material-symbols-outlined">how_to_reg </span>
                <div>Register</div>
              </NavLink>
            </div>
            <div className="options">
              <NavLink to="/Vote">
                <span class="material-symbols-outlined">ballot</span>
                <div>Vote</div>
              </NavLink>
            </div>
            <div className="options">
              <NavLink to="/getResult">
                <span class="material-symbols-outlined">bar_chart</span>
                <div>Result</div>
              </NavLink>
            </div>
          </div>
          <div className="down">
            <div className="logout">
              <span class="material-symbols-outlined">logout</span>
              <div
                onClick={() => {
                  nav("/");
                  props.setIsConnected(false);
                }}
              >
                Log Out
              </div>
            </div>
          </div>
        </div>

        <div id="rightSide">
          <Header
            RemainingTime={props.RemainingTime}
            startVote={props.startVote}
            updateRemainingTime={props.updateRemainingTime}
            isAdmin={props.isAdmin}
          />
          <Outlet />
        </div>
      </div>
    </>
  );
};
