import React, { useRef, useEffect, useState } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';

const ExerciseForm = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detector, setDetector] = useState(null);
  const [exerciseType, setExerciseType] = useState('squat');
  const [formFeedback, setFormFeedback] = useState('');

  useEffect(() => {
    initializePoseDetection();
    return () => {
      if (detector) detector.dispose();
    };
  }, []);

  const initializePoseDetection = async () => {
    await tf.ready();
    const model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
      runtime: 'tfjs',
      modelType: 'full'
    };
    const detector = await poseDetection.createDetector(model, detectorConfig);
    setDetector(detector);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
  };

  const analyzePose = async (poses) => {
    if (!poses || poses.length === 0) return;
    const pose = poses[0];

    switch (exerciseType) {
      case 'squat':
        analyzeSquatForm(pose);
        break;
      case 'pushup':
        analyzePushupForm(pose);
        break;
      default:
        break;
    }
  };

  const analyzeSquatForm = (pose) => {
    const kneeAngle = calculateAngle(
      pose.keypoints[23], // hip
      pose.keypoints[25], // knee
      pose.keypoints[27]  // ankle
    );

    let feedback = '';
    if (kneeAngle < 90) {
      feedback = 'Good depth!';
    } else if (kneeAngle < 120) {
      feedback = 'Go lower for full range of motion';
    } else {
      feedback = 'Squat deeper to engage muscles properly';
    }

    setFormFeedback(feedback);
  };

  const analyzePushupForm = (pose) => {
    const elbowAngle = calculateAngle(
      pose.keypoints[11], // shoulder
      pose.keypoints[13], // elbow
      pose.keypoints[15]  // wrist
    );

    let feedback = '';
    if (elbowAngle < 90) {
      feedback = 'Good form! Keep your core tight';
    } else {
      feedback = 'Lower your body until arms are at 90 degrees';
    }

    setFormFeedback(feedback);
  };

  const calculateAngle = (pointA, pointB, pointC) => {
    const radians = Math.atan2(
      pointC.y - pointB.y,
      pointC.x - pointB.x
    ) - Math.atan2(
      pointA.y - pointB.y,
      pointA.x - pointB.x
    );
    
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  };

  const detect = async () => {
    if (!detector || !videoRef.current) return;

    const video = videoRef.current;
    const poses = await detector.estimatePoses(video);
    
    if (poses.length > 0) {
      drawPose(poses[0]);
      analyzePose(poses);
    }

    requestAnimationFrame(detect);
  };

  const drawPose = (pose) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw keypoints
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
    });

    // Draw skeleton
    const connections = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.BlazePose);
    connections.forEach(([start, end]) => {
      const startPoint = pose.keypoints[start];
      const endPoint = pose.keypoints[end];

      if (startPoint.score > 0.5 && endPoint.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="aspect-video relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
          onPlay={() => detect()}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
      
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Exercise Form Analysis</h3>
          <select
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="squat">Squat</option>
            <option value="pushup">Push-up</option>
          </select>
        </div>
        
        {formFeedback && (
          <div className="p-3 bg-blue-50 text-blue-700 rounded">
            {formFeedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseForm;