# AI & ML Notes

This project contains scaffolding for browser-based AI features using TensorFlow.js and helper utilities under `src/utils/ai`.

Notes:
- Models used in development are expected to be loaded lazily (dynamic import) to avoid increasing initial bundle size.
- Some model dependencies were added (e.g., `@tensorflow/tfjs`, `@tensorflow-models/pose-detection`). In production, consider serving models from a CDN or using hosted model endpoints to reduce client load.
- The functions in `src/utils/ai` are mostly small helpers and mock implementations; connect them to real models and validate input shapes when integrating.

Security and performance:
- Heavy model libraries (tfjs) should be loaded only for users who open AI features.
- Consider quantized or WASM builds for performance on low-end devices.
