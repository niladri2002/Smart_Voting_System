# Smart_Voting_System

Welcome to the official GitHub repository of our Smart Voting System, eVote. This repository hosts the source code and project files for our innovative voting application aimed at revolutionizing the democratic process.

eVote leverages blockchain technology, face recognition, and real-time tracking to provide a secure, transparent, and convenient platform for remote voting. By combining the power of React, Python Flask, and Ethereum's Solidity, our application ensures seamless interactions and tamper-proof recording of votes.

Within this repository, you will find the frontend and backend code, smart contract implementations, face recognition algorithms, and other essential components that make eVote possible. We encourage collaboration and contributions from developers, designers, and blockchain enthusiasts to further enhance the features and security of our system.

Join us on this journey to reshape the future of voting and create a more inclusive and efficient democratic process. Feel free to explore the codebase, open issues, submit pull requests, and engage with our vibrant community of developers. Together, let's build a robust and trustworthy voting solution for the betterment of society.

Get involved and let your voice be heard with eVote!

## Steps To Setup project

1. Add MetaMask extension to chrome , create wallet if You haven’t (you can watch this video https://youtu.be/Af_lQ1zUnoM).
2. Add this Network to your wallet :-
   Network Name: Mumbai
   
   New RPC URL: https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78
   
   Chain ID: 80001
   
   Currency Symbol: MATIC
   
   Block Explorer URL: https://mumbai.polygonscan.com .

   Import Admin Account which will be required to register new voter :
   Click on account on metamask and then on import account , and then enter this private address: `c136853735ab4d302e76b89ba2d0f4f9a3379183acbe1d52af3aa9f840056fba` to add admin           acoount. create some other accounts to authorize them as voter.
   see this to setup mumbai polygon network: https://wiki.polygon.technology/docs/tools/wallets/metamask/config-polygon-on-metamask/

4. Clone the repo : git clone https://github.com/niladri2002/Smart_Voting_System.git
5. If you want to view frontend hosted in github visit this link after setting up flask_server(step 5)   https://sushanta-das.github.io/Smart-Voting-system/ 
   and  If you want to run frontend locally go to frontend folder inside Smart_Voting_System in terminal and run this command :  `npm i –-force` and run `npm run dev` after setting      backend 

6.  Backend (flask_Server setup is must for both viewing hosted frontend and running frontend locally )

  

    1.  Go to the flask_server folder

    2.  Install the required dependencies. It is recommended to use a virtual environment.

    3. ` pip install -r requirements.txt`

    If you have any problem installing face_recognition library and dlib
        follow this steps:
    
        1. pip install cmake
    
        2. pip install https://github.com/jloh02/dlib/releases/download/v19.22/dlib-19.22.99-cp310-cp310-win_amd64.whl
    
        3. pip install face_recognition

    4.  Obtain the `serviceAccountKey.json` file for Firebase Admin SDK and place it in the project root directory.
            Steps to obtain the serviceAccountKey.json by following the steps:-
            ->open firebase
            ->Go to console
            ->Create a new project
            ->Go to settings, then Service Accounts,then select python and Generate new private key, a file will get downloaded
            ->Rename the file just downloaded as ServiceAccountKey and keep it in the same directory as main.py
            ->Setup the realtime Database in test mode and storage(Optional) and paste the links in the desired ,inside main.py
            ->The server is ready to work

     5.  Run the flask_server:

                python main.py

     6.  The Flask server will start running on http://localhost:5000/.

7.  Smart contract is deployed in mumbai polygon matic Blockchain network. So there is no need to deploy again . if you want to deploy it again, you can deploy and make sure to update contract address in constants.js in consts folder under src folder.
8.  If you want to run frontend from hosted github page click this link https://sushanta-das.github.io/Smart-Voting-system/
            otherwise if you want run frontend locally run frontend by npm run dev in frontend folder.

Tutorial on how to use the application is provided in the given link "https://drive.google.com/file/d/1WO0uSGg5z5axv99zabekI_ZhjXEJZSKE/view?usp=drive_link"
