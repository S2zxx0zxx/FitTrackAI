// Lightweight wrapper to lazy-load MobileNet and classify an image element
export async function loadMobileNet() {
  // dynamic import so the bundle doesn't include the model until needed
  const tf = await import('@tensorflow/tfjs');
  const mobilenet = await import('@tensorflow-models/mobilenet');
  // ensure tf backend is ready (browser will use WebGL or cpu)
  if (tf && tf.ready) await tf.ready();
  const model = await mobilenet.load();
  return { tf, model };
}

export async function classifyImage(imgEl, model) {
  if (!model) throw new Error('Model not loaded');
  // model.classify accepts an HTMLImageElement, HTMLCanvasElement or ImageData
  const results = await model.classify(imgEl, 3);
  return results; // array of {className, probability}
}
