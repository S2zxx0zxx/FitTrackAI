import React, { useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { motion } from 'framer-motion';

const MealImageRecognition = ({ onFoodDetected }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef();
  const imageRef = useRef();

  // Load the MobileNet model
  const loadModel = async () => {
    const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    return model;
  };

  const analyzeImage = async (file) => {
    setIsAnalyzing(true);
    try {
      // Load and preprocess the image
      const image = await createImageBitmap(file);
      const tensor = tf.browser.fromPixels(image)
        .resizeBilinear([224, 224])
        .expandDims()
        .toFloat()
        .div(255.0);

      // Load model and get predictions
      const model = await loadModel();
      const predictions = await model.predict(tensor).data();

      // Get top 5 predictions
      const topPredictions = Array.from(predictions)
        .map((p, i) => ({ probability: p, className: FOOD_CLASSES[i] || 'unknown' }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 5);

      setResults(topPredictions);
      
      // Call parent callback with detected food
      if (topPredictions[0].probability > 0.5) {
        onFoodDetected(topPredictions[0].className);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        analyzeImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold"
          onClick={() => fileInputRef.current.click()}
        >
          Take Food Photo
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {preview && (
        <div className="relative rounded-lg overflow-hidden">
          <img
            ref={imageRef}
            src={preview}
            alt="Food preview"
            className="w-full h-48 object-cover"
          />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white">Analyzing...</div>
            </div>
          )}
        </div>
      )}

      {results && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Detected Foods:</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex justify-between items-center"
              >
                <span className="capitalize">
                  {result.className.replace('_', ' ')}
                </span>
                <span className="text-gray-600">
                  {(result.probability * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// List of food classes the model can recognize
const FOOD_CLASSES = [
  'apple', 'banana', 'bread', 'broccoli', 'burger',
  'cake', 'carrot', 'chicken', 'eggs', 'fish',
  'milk', 'orange', 'pasta', 'pizza', 'rice',
  'salad', 'sandwich', 'soup', 'steak', 'yogurt'
  // Add more food classes as needed
];

export default MealImageRecognition;