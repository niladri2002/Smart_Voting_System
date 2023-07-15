import React, { useState } from "react";
import Verifyface from "./verifyFace";
export const Vote = (props) => {
  console.log("canvote " + props.CanVote);
  const [toggleVerifyVote, settoggleVerifyVote] = useState(true);
  return (
    <>
      <div className="voteContainer">
        {toggleVerifyVote && !props.voted && props.CanVote ? (
          <Verifyface
            aadhar={props.aadhar}
            settoggleVerifyVote={settoggleVerifyVote}
          />
        ) : (
          <div>
            {props.CanVote && !props.voted ? (
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                  </tr>
                </thead>
                <tbody>
                  {props.Candidates.map((candidate, ind) => {
                    return (
                      <tr key={ind}>
                        <td>{candidate.Name}</td>
                        <td>
                          <button
                            onClick={() => {
                              props.vote(ind);
                            }}
                          >
                            Vote
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : props.voted ? (
              <div className="headings">You have already voted</div>
            ) : (
              <div className="headings"> You are not authorized to Vote</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
