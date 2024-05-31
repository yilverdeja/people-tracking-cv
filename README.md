# Person Detection CV Web App

This is a web application using React and Next.js that utilizes computer vision to detect and track people in real-time using the webcam as a video source. The application allows users to set a minimum confidence threshold to filter the detected objects and display them with bounding boxes.

## Getting Started

### Application

To start the application, first install the NPM packages

```bash
npm install
```

Start the development site using

```bash
npm run dev
```

To build use

```bash
npm run build
```

## Specification

### Training Model

This model detects **person** objects defined in the [COCO dataset](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd), which is a large-scale object detection, segmentation, and captioning dataset.

The detected objects will appear in bounding boxes. Tune the minimum score to only show **person** objects meeting a certain confidence value.

> A value of 5 means that a bounding box will appear if the model is at least 5% confident the object is a **person**.

### Tech Stack

Built with Typescript, NextJS, ReactJS, and TensorflowJS.

### Detector Class

Created an abstract Base Detector class that can be detected for using other models. Currently it has the following models:

1. Haar Cascade with OpenCV (Specifically Full face & Eyes)
2. Coco SSD with TensorFlow

Creating this class makes it easier to extend to other detectors and re-use the components.

### Other Models

This application was initially built using the Haar Cascade Models with OpenCV.js. The application can be found on the [other-models branch](https://github.com/yilverdeja/people-tracking-cv/tree/other-models) of this repository.

## Known Issues

### Not Available on Mobile

The application is responsive, however, on mobile, due to the different aspect ratio of the webcam, the application breaks.

Specifically, the canvas element is not laid over correctly over the webcam and hence it does not draw the bounding boxes correctly.

## Learnings & Improvements

This was my first time developing an OpenCV application, especially one in the browser with ReactJS and NextJS.

#### Haar Cascade Models

I initially implemented full-face and eyes detection with OpenCV.js and the Haar Cascade Models, however it was very slow, laggy and often blocked the UI. In addition, there wasn't an ability for setting the confidence level.

To improve the detection with this model, it would be good to create a web worker on a seperate thread and make the browser more accessible and interactible.

#### Coco SSD & TensorFlow.js

I learned how to implement the tensor flow pre-trained Coco SSD model on the browser with the help from this [repository](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd).

#### YoloV5 & TensorFlow.js

A future improvement would be to use the YoloV5 model instead with help from this [repository](https://github.com/Hyuto/yolov5-tfjs).

## Remarks

As mentioned, there was a learning curve and figuring out how to work with OpenCVJs in the browser.

In addition, the Coco-SSD detector only allows updating the minimum confidence levels for returning a bounding box of a detected object. Unfortunately, I did not have time to work with other models and play with other settings to adjust the confidence of the models internally.
