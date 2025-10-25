import { useEffect, useRef, useCallback } from 'react';
import * as handpose from '@tensorflow-models/handpose';

const useGestureControls = (onGesture) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const modelRef = useRef(null);
  const animationFrameRef = useRef(null);

  const interpretGesture = useCallback((landmarks) => {
    const calculateDistance = (point1, point2) => {
      return Math.sqrt(
        Math.pow(point1[0] - point2[0], 2) +
        Math.pow(point1[1] - point2[1], 2)
      );
    };

    const isSwipeGesture = (landmarks) => {
      const fingerTips = [8, 12, 16, 20];
      const avgY = fingerTips.reduce((sum, i) => sum + landmarks[i][1], 0) / 4;
      const isAligned = fingerTips.every(i => Math.abs(landmarks[i][1] - avgY) < 20);
      return isAligned;
    };

    const thumb = landmarks[4];
    const indexFinger = landmarks[8];
    const middleFinger = landmarks[12];

    const thumbToIndex = calculateDistance(thumb, indexFinger);
    const indexToMiddle = calculateDistance(indexFinger, middleFinger);

    if (thumbToIndex < 30) return 'tap';
    if (indexToMiddle < 20) return 'pinch';
    if (isSwipeGesture(landmarks)) return 'swipe';
    return null;
  }, []);

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
  }, [onGesture, interpretGesture]);

  

  return { videoRef };
};

export default useGestureControls;