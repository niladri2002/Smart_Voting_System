import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import {
  contract_address,
  contract_abi,
  BaseUrl,
} from "../../Consts/constants.js";
axios.defaults.baseURL = BaseUrl;

function Register(props) {
  const [isAdmin, setisAdmin] = useState(true);
  useEffect(() => {
    const check = async () => {
      const checkadmin = await props.isAdmin();
      setisAdmin(checkadmin);
      console.log("is Admin" + checkadmin);
    };
    check();
  }, []);
  return (
    <>
      {isAdmin ? (
        <RegisterComponent
          isAdmin={props.isAdmin}
          authorize={props.authorize}
        />
      ) : (
        <div className="headings" style={{ textAlign: "center" }}>
          You are not admin
        </div>
      )}
    </>
  );
}

function RegisterComponent(props) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [VideoHide, setVideoHide] = useState(false);
  const [formValues, setFormValues] = useState({
    aadhar: "",
    publicAddress: "",
    firstName: "",
    lastName: "",
    phone: "",
    age: "19",
    dob: "23/6/2003",
    email: "",
    state: "West bengal",
    city: "Durgapur",
  });

  useEffect(() => {
    const video = videoRef.current;

    return () => {
      if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startCapture = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
        // Handle the error if needed
      });
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 300;

    // Capture image from webcam
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = canvas.toDataURL("image/jpeg");

    // Stop the video stream
    const video = videoRef.current;
    const tracks = video.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null; // Reset the video source object
    // setVideoHide(true);
    // Update captured image state
    setCapturedImage(imageData);
  };

  const handleFormInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form fields
    const isFormValid = Object.values(formValues).every(
      (value) => value !== ""
    );
    if (!isFormValid || !capturedImage) {
      alert("Please fill in all the fields and capture an image.");
      return;
    }

    // Prepare data for API call
    const data = {
      image: capturedImage,
      formData: {
        aadhar: formValues.aadhar,

        firstName: formValues.firstName,
        lastName: formValues.lastName,
        phone: formValues.phone,
        age: formValues.age,
        dob: formValues.dob,
        email: formValues.email,
        state: formValues.state,
        city: formValues.city,
      },
    };

    // Make API call
    axios
      .post("/register", data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    props.authorize(
      formValues.publicAddress,
      formValues.firstName,
      formValues.aadhar
    );

    // Clear form data and captured image
    setFormValues({
      aadhar: "",
      publicAddress: "",
      firstName: "",
      lastName: "",
      phone: "",
      age: "19",
      dob: "23/6/2003",
      email: "",
      state: "west bengal",
      city: "Durgapur",
    });
    setCapturedImage(null);
  };

  return (
    <div>
      <br />
      <div className="RegisterForm">
        <div className="photo">
          {capturedImage && (
            <img src={capturedImage} alt="Captured" width="400" height="300" />
          )}
          {!VideoHide ? (
            <video
              ref={videoRef}
              width="400"
              height="300"
              autoPlay
              muted
              style={{ borderRadius: "14px" }}
            ></video>
          ) : (
            <></>
          )}
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            width="400"
            height="300"
          ></canvas>
          <div>
            {" "}
            <button onClick={startCapture}>Start Webcam</button>
            <button onClick={captureImage}>Capture Image</button>
          </div>
        </div>

        <div className="inputs">
          <h1>Register</h1>

          <form onSubmit={handleSubmit} className="inputform">
            <label>
              Aadhar No:
              <input
                type="text"
                name="aadhar"
                value={formValues.aadhar}
                onChange={handleFormInputChange}
              />
            </label>
            <br />
            <label>
              Public Address:
              <input
                type="text"
                name="publicAddress"
                value={formValues.publicAddress}
                onChange={handleFormInputChange}
                style={{ width: "60%" }}
              />
            </label>
            <br />
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={formValues.firstName}
                onChange={handleFormInputChange}
              />
            </label>
            <br />
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={formValues.lastName}
                onChange={handleFormInputChange}
              />
            </label>
            <br />
            <label>
              Phone No:
              <input
                type="text"
                name="phone"
                value={formValues.phone}
                onChange={handleFormInputChange}
              />
            </label>
            {/* <br /> */}
            {/* <label>
                Age:
                <input
                  type="text"
                  name="age"
                  value={formValues.age}
                  onChange={handleFormInputChange}
                />
              </label> */}
            {/* <br /> */}
            {/* <label>
                Date of Birth:
                <input
                  type="text"
                  name="dob"
                  value={formValues.dob}
                  onChange={handleFormInputChange}
                />
              </label> */}
            <br />
            <label>
              Email:
              <input
                type="text"
                name="email"
                value={formValues.email}
                onChange={handleFormInputChange}
              />
            </label>
            <br />

            <button className="submitBtn" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
