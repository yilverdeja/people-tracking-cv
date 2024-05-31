# Person Detection

This application can detect the face and eyes of a person in front of their webcam. Users can change the minimum neighbors value to change the accuracy of their detection.

## Tech Stack

Built with Typescript, NextJS, ReactJS, and OpenCV.js.

## Models

Using the haarcascade frontal face and eye models.

## Improvements

-   [ ] Create a web worker to run the face detection on a seperate thread and make the browser more accessible and interactible
-   [ ] Implement a DNN model to work with confidence levels
-   [ ] Not responsive (Canvas needs to adjust to the Webcam size, not the parent div. Works on PC, but not on mobile due to vertical view)
-   [ ] Add threshold input
-   [x] Create a class / utility to render the boxes on a canvas
-   [x] Encapsulate usage of different models in different pages
-   [ ] Try Object Detection using YOLOv5 and Tensorflor.js (see this [example](https://github.com/Hyuto/yolov5-tfjs))
