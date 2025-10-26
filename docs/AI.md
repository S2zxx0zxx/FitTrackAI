## AI Demo

This project includes a small lazy-loaded AI image demo that uses MobileNet via TensorFlow.js. The demo is intentionally lazy-loaded so the main application bundle stays small.

Files:

- `src/components/AIImageDemo.jsx` — UI component that lets users upload an image and classify it using MobileNet. The model is loaded on demand.
- `src/utils/ai/imageClassifier.js` — wrapper that dynamically imports `@tensorflow/tfjs` and `@tensorflow-models/mobilenet` and exposes `loadMobileNet` and `classifyImage`.

Testing:

- The demo includes a test that mocks the `imageClassifier` module so CI doesn't need to download models or run TensorFlow.

Licensing / model origin:

- MobileNet is provided by `@tensorflow-models/mobilenet`. Check their repository and license for details.

How to use locally:

1. Run `npm install` to fetch the model package.
2. Start the dev server and open the AI demo UI somewhere in the app (you can import the component in a page).

Notes:

- For production use, prefer to run inference on-device and be mindful of privacy — do not upload user images unless you have consent and a secure backend.
