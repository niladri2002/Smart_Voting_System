import base64
import face_recognition
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np


from flask_socketio import SocketIO, emit
import time
import cv2
import socket
import os
import threading
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import storage

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://smart-voting-system-51af2-default-rtdb.firebaseio.com/",
    'storageBucket': "smart-voting-system-51af2.appspot.com"
})


app = Flask(__name__)
CORS(app)  # Allow all origins for CORS
# Enable CORS for all routes
# do the encodings


def findencodings(img):
    encodeList = []
    # print("Imglistsize",len(imgList))

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encode = face_recognition.face_encodings(img)[0]
    encodeList.append(encode)
    return encodeList


@app.route('/register', methods=['POST'])
def receive_image():
    try:
        print("Got the image")
        data = request.get_json()
        image_data = data.get('image')
        print(image_data)
        base = image_data[23:]

        # Convert the base64-encoded image to a NumPy array
        image_array = np.frombuffer(base64.b64decode(base), dtype=np.uint8)
        print("Got the image")
        # Decode the image using OpenCV
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        form_data = data.get('formData')
        aadhar = form_data.get('aadhar')
        ref = db.reference('Voters')
        if ref.child(aadhar).get() is not None:
            return jsonify({'message': 'Data already exists'})

        # Check if the image dimensions are valid
        if image is not None and image.size != 0:
            print("Here")
            image = cv2.resize(image, (216, 216))
            # Save the image to a file in the "Images" folder
            image_path = os.path.join('Images', f'{aadhar}.jpg')
            cv2.imwrite(image_path, image)
            # cv2.imshow('Received Image', image)
            # cv2.waitKey(0)
            # cv2.destroyAllWindows()

            # Extract form data

            firstName = form_data.get('firstName')
            lastName = form_data.get('lastName')
            phone = form_data.get('phone')
            age = form_data.get('age')
            dob = form_data.get('dob')
            email = form_data.get('email')
            state = form_data.get('state')
            city = form_data.get('city')

            # Process the form data as needed
            face_encodings = findencodings(image)
            face_encodings_serializable = []
            for encoding in face_encodings:
                encoding_list = []
                for value in encoding:
                    encoding_list.append(float(value))
                face_encodings_serializable.append(encoding_list)
            # face_encodings_list = face_encodings.tolist()
            # face_encodings_float = [list(encoding) for encoding in face_encodings]
            # print(encoding)
            # put data inside database
            fileName = image_path
            bucket = storage.bucket()
            blob = bucket.blob(fileName)
            blob.upload_from_filename(fileName)

            # data

            data = {
                f'{aadhar}': {
                    "FirstName": f"{firstName}",
                    "LastName": f"{lastName}",
                    "Phone Number": f"{phone}",
                    "Age": f"{age}",
                    "Date of Birth": f"{dob}",
                    "Email": f"{email}",
                    "State": f'{state}',
                    "City": f'{city}',
                    'Encodings': face_encodings_serializable,
                }
            }

            for key, value in data.items():
                ref.child(key).set(value)

            print("Data stored successfully")
            os.remove(image_path)
            # Return a success response
            return jsonify({'message': 'Image received and stored successfully'})

        # Return an error response if the image dimensions are invalid
        return jsonify({'error': 'Invalid image dimensions'})

    except Exception as e:
        # Handle any exceptions that occur during image processing
        return jsonify({'error from exception': str(e)})


@app.route('/vote', methods=['POST'])
def vote():
    data = request.get_json()
    image_data = data.get('image')
    base = image_data[23:]
    aadhar = data.get('aadhar')

    image_array = np.frombuffer(base64.b64decode(base), dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    imgS = cv2.resize(image, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    faceCurFrame = face_recognition.face_locations(imgS)
    encodeCurrentFrame = face_recognition.face_encodings(imgS, faceCurFrame)

    peopleinfo = db.reference(f'Voters/{aadhar}/Encodings').get()

    # folderPath = "Images"
    # PathList = os.listdir(folderPath)
    # imgList = []
    # for path in PathList:
    #     imgList.append(cv2.imread(os.path.join(folderPath, path)))
    # encodeList = []
    # for img in imgList:
    #     img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    #     encode = face_recognition.face_encodings(img)[0]
    #     encodeList.append(encode)
    print(peopleinfo)

    file = open("EncodeFile.p", "wb")
    pickle.dump(peopleinfo, file)
    file.close()
    file = open("EncodeFile.p", 'rb')
    people = pickle.load(file)
    file.close()
    print("Encode finished")

    for encodeFace, faceLoc in zip(encodeCurrentFrame, faceCurFrame):
        print("Inside loop")
        matches = face_recognition.compare_faces(people, encodeFace)
        faceDis = face_recognition.face_distance(people, encodeFace)
        print("matches", matches)
        print("matches", faceDis)
        if matches[0]:
            print("Matches")
            result = 'Success'
            return jsonify("True")
    return jsonify("Not true")

# Timer


duration = 0
endtime = 0


@app.route('/set-duration', methods=['POST'])
def set_duration():
    global duration, endtime

    data = request.get_json()
    duration = int(data.get('duration'))
    endtime = int(time.time()) + duration*60

    return jsonify({'message': 'Duration set successfully'})


@app.route('/get-remaining-time', methods=['GET'])
def get_remaining_time():
    currenttime = int(time.time())
    remaining_time = max(0, endtime - currenttime)
    return jsonify({'remainingTime': remaining_time})


if __name__ == '__main__':
    # Get the hostname and port
    hostname = socket.gethostname()
    port = 5000  # Default Flask port

  # Start the server
    print(f"Flask server running on http://{hostname}:{port}/")
    app.run(host=hostname, port=port)
# Print the server details

# Default Flask port
