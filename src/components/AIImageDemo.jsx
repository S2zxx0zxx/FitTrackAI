import React, { useState, useRef, Suspense } from 'react';
import { loadMobileNet, classifyImage } from '../utils/ai/imageClassifier';

export default function AIImageDemo() {
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);
  const modelRef = useRef(null);

  const handleLoadModel = async () => {
    setLoading(true);
    setError(null);
    try {
      const { model } = await loadMobileNet();
      modelRef.current = model;
      setModelReady(true);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (imgRef.current) imgRef.current.src = url;
  };

  const handleClassify = async () => {
    if (!modelRef.current) {
      setError('Model not loaded');
      return;
    }
    if (!imgRef.current || !imgRef.current.complete) {
      setError('Please choose an image and wait for it to load');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await classifyImage(imgRef.current, modelRef.current);
      setResults(res);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold mb-3">AI Image Demo (lazy-loaded)</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label htmlFor="ai-image-input" className="sr-only">Choose image to classify</label>
          <input id="ai-image-input" type="file" accept="image/*" onChange={handleFile} aria-label="Choose image to classify" />
          <button className="btn" onClick={handleLoadModel} disabled={loading || modelReady}>
            {modelReady ? 'Model loaded' : loading ? 'Loading...' : 'Load model'}
          </button>
          <button className="btn" onClick={handleClassify} disabled={!modelReady || loading}>
            Classify image
          </button>
        </div>

        <div className="flex gap-4 items-start">
          <div className="w-40 h-40 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
            <img ref={imgRef} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div className="flex-1">
            {error && <div className="text-red-500">{error}</div>}
            {loading && <div>Working...</div>}
            {!loading && modelReady && results && results.length > 0 && (
              <div>
                <h4 className="font-medium">Predictions</h4>
                <ol className="list-decimal pl-5">
                  {results.map((r, i) => (
                    <li key={i} className="py-1">
                      <span className="font-medium">{r.className}</span>
                      <span className="opacity-70"> — {(r.probability * 100).toFixed(1)}%</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {!modelReady && <div className="text-sm opacity-70">Model is lazy-loaded to keep the bundle small.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
