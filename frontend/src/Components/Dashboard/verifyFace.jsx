import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  contract_address,
  contract_abi,
  BaseUrl,
} from "../../Consts/constants.js";
axios.defaults.baseURL = BaseUrl;
function Verifyface(props) {
  const videoRef = useRef(null);
  const [detectionResult, setDetectionResult] = useState(null);
  // const [formValues, setFormValues] = useState({ aadhar: "" });

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const stopWebcam = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const sendImageToBackend = (imageData) => {
    // Prepare data for API call

    const data = {
      image: imageData,
      aadhar: props.aadhar,
    };

    // Make API call to the 'vote' endpoint
    axios
      .post("/vote", data)
      .then((response) => {
        console.log("Detection Result", response.data);
        setDetectionResult(response.data);
        stopWebcam(); // Stop the webcam if message received from backend
      })
      .catch((error) => {
        console.error("error sending data to verify " + error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Capture image from webcam
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = canvas.toDataURL("image/jpeg");

    // Send image and Aadhar number to backend
    sendImageToBackend(imageData);
  };

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const startWebcam = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
        // Handle the error if needed
      });
  };

  useEffect(() => {
    startWebcam();

    return () => {
      stopWebcam();
    };
  }, []);
  const handleNext = () => {
    if (detectionResult == "True") {
      props.settoggleVerifyVote(false);
    }
  };
  return (
    <>
      <div className="headings">Verify Your Face</div>
      <div>
        <video
          ref={videoRef}
          width="400"
          height="300"
          autoPlay
          muted
          style={{ borderRadius: "14px" }}
        ></video>
      </div>

      <div className="btns">
        {" "}
        <form onSubmit={handleSubmit}>
          {detectionResult == "True" ? <p>Face Matched</p> : <p></p>}
          {detectionResult == "Not true" ? <p>Face did not Match</p> : <p></p>}
          {detectionResult == null && <button type="submit">Submit</button>}
        </form>
        <button
          style={{
            backgroundColor: detectionResult != "True" ? "grey" : "#451c77",
            alignSelf: "flex-end",
          }}
          onClick={() => {
            handleNext();
          }}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Verifyface;
