import "@babel/polyfill";
import * as mobilenetModule from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import { repeatGameState, setClassesProbability } from "./basic.js";

const NUM_CLASSES = 3;
const CLASSES_NAME = ["LEFT", "STRAIGHT", "RIGHT"];
const CLASSES_PROBABILITY = [0, 0, 0];
const ELEMENT_TAGS = [];
const IMAGE_SIZE = 227;
const TOPK = 10;

class Main {
  constructor() {
    this.training = -1;
    this.videoPlaying = false;
    this.count = 0;

    //Setting Up Video tag
    this.video = document.createElement("video");
    this.video.className = "webCam";
    this.video.setAttribute("autoplay", "");
    this.video.setAttribute("playsinline", "");

    document.body.appendChild(this.video);

    this.video.addEventListener("playing", () => {
      this.videoPlaying = true;
    });

    this.video.addEventListener("pause", () => {
      this.videoPlaying = false;
    });

    let mainControls = document.createElement("ul");
    mainControls.className = "controls";

    for (let i = 0; i < NUM_CLASSES; i++) {
      let container = document.createElement("li");
      container.className = "controls-container";

      let elm = document.createElement("button");
      elm.className = "controls-container-button";
      elm.innerHTML = CLASSES_NAME[i];

      elm.addEventListener("mousedown", () => {
        this.training = i;
      });

      elm.addEventListener("mouseup", () => {
        this.training = -1;
      });

      let text = document.createElement("span");
      text.innerHTML = "0%";

      container.appendChild(elm);
      container.appendChild(text);

      ELEMENT_TAGS.push(text);
      mainControls.appendChild(container);
    }

    document.body.appendChild(mainControls);
    // All critical func's
    this.executeInOrder();
  }

  async executeInOrder() {
    await this.setupMediaDevices();
    await this.initializeModel();
    this.start();
  }

  async setupMediaDevices() {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    this.video.width = IMAGE_SIZE;
    this.video.height = IMAGE_SIZE;
    this.video.srcObject = stream;
  }

  async initializeModel() {
    this.knn = knnClassifier.create();
    this.mobilenet = await mobilenetModule.load();
  }

  start() {
    this.video.play();
    this.timer = requestAnimationFrame(this.getDirection.bind(this));
  }

  getDirection() {
    try {
      repeatGameState();

      if (this.videoPlaying) {
        const image = tf.fromPixels(this.video);
        let logits = this.mobilenet.infer(image, "conv_preds");

        // training
        if (this.training != -1) {
          this.knn.addExample(logits, this.training);
        }

        if (this.knn.getNumClasses() > 0) {
          this.knn.predictClass(logits, TOPK).then((res) => {
            if (logits) logits.dispose();

            // The number of examples for each class
            const exampleCount = this.knn.getClassExampleCount();

            for (let i = 0; i < NUM_CLASSES; i++) {
              if (i != res.classIndex) {
                ELEMENT_TAGS[i].style.color = "black";
                ELEMENT_TAGS[i].style.fontWeight = "";
              } else {
                ELEMENT_TAGS[i].style.color = "red";
                ELEMENT_TAGS[i].style.fontWeight = "bold";
              }

              if (i in res.confidences) {
                ELEMENT_TAGS[i].innerHTML = ` ${exampleCount[i]} examples - ${
                  res.confidences[i] * 100
                }%`;
                CLASSES_PROBABILITY[i] = +res.confidences[i];
              }
            }
            setClassesProbability(CLASSES_PROBABILITY);
          });
        }

        image.dispose();
      }
      this.timer = requestAnimationFrame(this.getDirection.bind(this));
    } catch (err) {
      console.log(err);
      this.timer = requestAnimationFrame(this.getDirection.bind(this));
    }
  }
}

window.addEventListener("load", () => new Main());
