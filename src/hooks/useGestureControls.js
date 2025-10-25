import { useEffect, useRef } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';

const useGestureControls = (onGesture) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const modelRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    const initGestureDetection = async () => {
      try {
        // Load the HandPose model
        modelRef.current = await handpose.load();

        // Access webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Start detection loop
        detectGestures();
      } catch (error) {
        console.error('Error initializing gesture detection:', error);
      }
    };

    const detectGestures = async () => {
      if (!modelRef.current || !videoRef.current || !isActive) return;

      try {
        const hands = await modelRef.current.estimateHands(videoRef.current);
        
        if (hands.length > 0) {
          const gesture = interpretGesture(hands[0].landmarks);
          if (gesture) {
            onGesture(gesture);
          }
        }
      } catch (error) {
        console.error('Error detecting gestures:', error);
      }

      animationFrameRef.current = requestAnimationFrame(detectGestures);
    };

    initGestureDetection();

    return () => {
      isActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onGesture]);

  const interpretGesture = (landmarks) => {
    // Calculate key points
    const thumb = landmarks[4];
    const indexFinger = landmarks[8];
    const middleFinger = landmarks[12];
    
    // Calculate distances
    const thumbToIndex = calculateDistance(thumb, indexFinger);
    const indexToMiddle = calculateDistance(indexFinger, middleFinger);
    
    // Interpret gestures
    if (thumbToIndex < 30) {
      return 'tap';
    } else if (indexToMiddle < 20) {
      return 'pinch';
    } else if (isSwipeGesture(landmarks)) {
      return 'swipe';
    }
    
    return null;
  };

  const calculateDistance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point1[0] - point2[0], 2) +
      Math.pow(point1[1] - point2[1], 2)
    );
  };

  const isSwipeGesture = (landmarks) => {
    // Calculate average vertical position of fingers
    const fingerTips = [8, 12, 16, 20];
    const avgY = fingerTips.reduce((sum, i) => sum + landmarks[i][1], 0) / 4;
    
    // Check if fingers are extended and aligned horizontally
    const isAligned = fingerTips.every(i => 
      Math.abs(landmarks[i][1] - avgY) < 20
    );
    
    return isAligned;
  };

  return { videoRef };
};

export default useGestureControls;