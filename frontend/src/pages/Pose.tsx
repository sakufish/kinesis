import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from "@tensorflow/tfjs";
import Webcam from 'react-webcam';

import { useEffect, useRef, useState } from 'react';

const detectorConfig = {
    runtime: 'tfjs',
    modelType: 'SinglePose.Lightning',
    modelUrl: 'https://storage.googleapis.com/tfhub-tfjs-modules/google/tfjs-model/movenet/singlepose/lightning/4/model.json'
};

const Pose = () => {
    const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);

    const [upY, setUpY] = useState<number | null>(null);
    const [downY, setDownY] = useState<number | null>(null);
    const [currentPosition, setCurrentPosition] = useState<"up" | "down">("up");
    const [percentage, setPercentage] = useState<number | null>(null);
    const [count, setCount] = useState(0);
    const [isCounting, setIsCounting] = useState(false);

    const webcamRef = useRef<Webcam>(null);

    useEffect(() => {
        tf.setBackend("webgl").then(() => {
            const MoveNet = poseDetection.SupportedModels.MoveNet;
            poseDetection.createDetector(MoveNet, detectorConfig).then((detector) => {
                setDetector(detector);
            });
        })
        .catch(() => window.alert("Failed to load webgl"));
    }, []);

    const getPoses = async () => {
        if (detector && webcamRef.current && webcamRef.current.video) {
            const webcam = webcamRef.current.video;
            const poses = await detector.estimatePoses(webcam, {
                maxPoses: 1,
                flipHorizontal: false,
                scoreThreshold: 0.3
            });

            if (poses.length > 0) {
                return poses;
            }
        }
        return null;
    }

    const getShoulderY = async () => {
        const poses = await getPoses();
        if (!poses) {
            return null;
        }
        return poses[0].keypoints[5].y + poses[0].keypoints[6].y / 2;
    }

    const setUpPosition = async () => {
        const shoulderY = await getShoulderY();
        if (shoulderY) {
            setUpY(shoulderY);
        }
    }

    const setDownPosition = async () => {
        const shoulderY = await getShoulderY();
        if (shoulderY) {
            setDownY(shoulderY);
        }
    }

    const getPercentage = async () => {
        if (!upY || !downY) {
            return null;
        }

        const shoulderY = await getShoulderY();
        if (!shoulderY) {
            return null;
        }

        return (shoulderY - upY) / (downY - upY);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (!upY || !downY || !isCounting) {
                return;
            }
    
            getPercentage().then((percentage) => {
                if (!percentage) {
                    return;
                }
    
                setPercentage(percentage);
    
                if (percentage < 0.2 && currentPosition === "down") {
                    setCurrentPosition("up");
                    setCount((prevCount) => prevCount + 1);
                } else if (percentage > 0.8 && currentPosition === "up") {
                    setCurrentPosition("down");
                }
            });
        }, 100);
    
        return () => clearInterval(interval);
    }, [detector, upY, downY, currentPosition, count, isCounting]);
    

    return (
        <div>
            <h1>Pose Detection</h1>
            <Webcam ref={webcamRef} videoConstraints={{
                frameRate: { max: 30 },
            }}/>
            <button onClick={async () => {
                await setUpPosition();
            }}>Calibrate Up</button>
            <button onClick={async () => {
                await setDownPosition();
            }}>Calibrate Down</button>

            <button onClick={() => {
                setIsCounting((prevIsCounting) => !prevIsCounting);
            }}>{isCounting ? "Stop" : "Start"} Counting</button>

            <p>Up Y: {upY}, Down Y: {downY}</p>
            <p>Count: {count}</p>
            <p>Current Position: {currentPosition}</p>
            {percentage && <p>Percentage: {percentage}</p>}
        </div>
    )
}

export default Pose;