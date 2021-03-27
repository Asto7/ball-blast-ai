import "@babel/polyfill";
import * as mobilenetModule from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import * as knnClassifier from "@tensorflow-models/knn-classifier";

onmessage = function (e) {
  switch (e.data.command) {
    case "init":
      init(e.data.model);
      break;

    case "executeInOrder":
      executeInOrder(e.data.payloads);
      break;
    case "addExample":
      addExample(e.data.logits, e.data.trainingIndex);
      break;

    case "process":
      process(e.data.logits, e.data.TOPK);
      break;

    case "reset":
      reset();
      break;
  }
};

let knn;
let mobilenet;

async function init() {
  knn = knnClassifier.create();
  mobilenet = await mobilenetModule.load();
  console.log(mobilenet);
}

async function executeInOrder(payloads) {
  //   const imageTensor = tf.fromPixels(payloads.image);
  //   console.log(imageTensor);
  let logits = mobilenet.infer(payloads.image, "conv_preds");

  // training
  if (payloads.trainingIndex != -1) addExample(logits, payloads.trainingIndex);

  await processModel(logits, payloads.TOPK);
}

function addExample(logits, training) {
  knn.addExample(logits, training);
}

async function processModel(logits, TOPK) {
  if (knn.getNumClasses() > 0) {
    let res = await knn.predictClass(logits, TOPK);
    if (logits) logits.dispose();

    // The number of examples for each class
    const exampleCount = knn.getClassExampleCount();

    cout << "COMES";
    postMessage({
      command: "update_class_probabilities",
      exampleCount: exampleCount,
      res: res,
    });
  }
}
