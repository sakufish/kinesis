import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from "@tensorflow/tfjs";
import Webcam from 'react-webcam';

import { useEffect, useRef, useState } from 'react';

import workouts from '../constants/workouts';
import RepProgressIndicator from '../components/RepProgressIndicator';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const detectorConfig = {
    runtime: 'tfjs',
    modelType: 'SinglePose.Lightning',
    modelUrl: 'https://storage.googleapis.com/tfhub-tfjs-modules/google/tfjs-model/movenet/singlepose/lightning/4/model.json'
};

const Pose = () => {
    const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);

    const [workout, setWorkout] = useState("Pushups");

    const [startNum, setStartNum] = useState<number | null>(null);
    const [middleNum, setMiddleNum] = useState<number | null>(null);
    const [currentPosition, setCurrentPosition] = useState<"start" | "middle">("start");
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

    const getPosition = async () => {
        const poses = await getPoses();
        if (!poses) {
            return null;
        }

        const workoutConfig = workouts[workout];
        const num = workoutConfig.function(poses[0]);
        return num;
    }

    const setStartPosition = async () => {
        const num = await getPosition();
        if (num) {
            setStartNum(num);
        }
    }

    const setDownPosition = async () => {
        const num = await getPosition();
        if (num) {
            setMiddleNum(num);
        }
    }

    const startCalibration = async () => {
        setTimeout(() => {
            setStartPosition();
        }, 5000);
        setTimeout(() => {
            setDownPosition();
        }, 3000);
    }

    const getPercentage = async () => {
        if (!startNum || !middleNum) {
            return null;
        }

        const num = await getPosition();
        if (!num) {
            return null;
        }

        const diff = middleNum - startNum;
        return (num - startNum) / diff;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (!startNum || !middleNum || !isCounting) {
                return;
            }
    
            getPercentage().then((percentage) => {
                if (!percentage) {
                    return;
                }
    
                setPercentage(percentage);
    
                if (percentage < workouts[workout].startPercentage && currentPosition === "middle") {
                    setCurrentPosition("start");
                    setCount((prevCount) => prevCount + 1);
                } else if (percentage > 0.7 && currentPosition === "start") {
                    setCurrentPosition("middle");
                }
            });
        }, 10);
    
        return () => clearInterval(interval);
    }, [detector, startNum, middleNum, currentPosition, count, isCounting]);
    

    return (
        <div>
            <h1>Pose Detection</h1>
            <Webcam ref={webcamRef} videoConstraints={{
                frameRate: { max: 30 },
            }}/>

            {/* <CountdownCircleTimer
                isPlaying={isStartingPositionCountdownPlaying}
                duration={5}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                onComplete={() => {
                    setStartPosition();
                }}
            >
                {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer>

            <CountdownCircleTimer
                isPlaying={isMiddlePositionCountdownPlaying}
                duration={5}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                onComplete={() => {
                    setDownPosition();
                }}
            >
                {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer> */}

            <button onClick={startCalibration}>Start Calibration</button>

            <button onClick={() => {
                setIsCounting((prevIsCounting) => !prevIsCounting);
            }}>{isCounting ? "Stop" : "Start"} Counting</button>

            <p>Start Num: {startNum}, Middle Num: {middleNum}</p>
            <p style={{
                fontSize: "100px"
            }} >Count: {count}</p>
            <p>Current Position: {currentPosition}</p>
            {percentage && <p>Percentage: {percentage * 100}%</p>}
            <RepProgressIndicator
                startPercentage={workouts[workout].startPercentage}
                middlePercentage={workouts[workout].middlePercentage}
                currentPosition={currentPosition}
                currentPercentage={percentage}
            />
        </div>
    )
}

export default Pose;