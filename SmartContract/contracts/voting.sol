// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

//candidate , name ,voteCount
//voters, name,authorized, voted
//admin address
contract VotingSystem {
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    struct Voter {
        string name;
        bool authorized;
        string aadhar;
        bool voted;
    }
    address public admin;
    Candidate[] public candidates;
    mapping(address => Voter) Voters;
    uint256 startTime;
    uint256 endTime;
    uint256 RegisteredVoterCount = 0;
    uint256 votedVoterCount = 0;

    constructor(string[] memory CandidateNames) {
        for (uint8 i = 0; i < CandidateNames.length; i++) {
            candidates.push(Candidate({name: CandidateNames[i], voteCount: 0}));
        }
        admin = msg.sender;
        Authorize(admin, "Admin", "658365836483");
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoters(address addr) public view returns (Voter memory) {
        return Voters[addr];
    }

    function getVotedVoterCount() public view returns (uint256) {
        return votedVoterCount;
    }

    function getRegisteredVoterCount() public view returns (uint256) {
        return RegisteredVoterCount;
    }

    function Authorize(
        address Voter_address,
        string memory Voter_name,
        string memory aadharNo
    ) public {
        require(msg.sender == admin, "You are not Admin");
        require(!Voters[Voter_address].authorized, "Already Authorized");
        Voters[Voter_address].name = Voter_name;
        Voters[Voter_address].authorized = true;
        Voters[Voter_address].aadhar = aadharNo;
        Voters[Voter_address].voted = false;
        if (Voter_address != admin) RegisteredVoterCount++;
    }

    function Vote(uint8 candidate_index) public {
        require(Voters[msg.sender].authorized, "You are not authorized");
        require(!Voters[msg.sender].voted, "You have already voted");
        require(endTime > block.timestamp, "Voting time is over");
        candidates[candidate_index].voteCount += 1;
        Voters[msg.sender].voted = true;
        votedVoterCount++;
    }

    function getWinnerIndex() public view returns (uint8) {
        uint256 maxVote = 0;
        uint8 maxVoteIndex;
        //assuming only one max Vote
        for (uint8 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVote) {
                maxVote = candidates[i].voteCount;
                maxVoteIndex = i;
            }
        }
        return maxVoteIndex;
    }

    function getWinnerName() public view returns (string memory) {
        return (candidates[getWinnerIndex()].name);
    }

    function getWinnerVoteCount() public view returns (uint256) {
        return (candidates[getWinnerIndex()].voteCount);
    }

    function start(uint256 duration) public {
        startTime = block.timestamp;
        endTime = startTime + duration * 60; //duration in minutes
    }

    function getRemainingTime() public view returns (uint256) {
        if (endTime > block.timestamp) return endTime - block.timestamp;
        else return 0;
    }
}
