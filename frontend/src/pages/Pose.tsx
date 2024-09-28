import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from "@tensorflow/tfjs";
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
import workouts from '../constants/workouts';
import RepProgressIndicator from '../components/RepProgressIndicator';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useSearchParams } from 'react-router-dom';

const detectorConfig = {
    runtime: 'tfjs',
    modelType: 'SinglePose.Lightning',
    modelUrl: 'https://storage.googleapis.com/tfhub-tfjs-modules/google/tfjs-model/movenet/singlepose/lightning/4/model.json'
};

const Pose = () => {
    const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);

    const [workout, setWorkout] = useState("Pushups");

    const [searchParams, setSearchParams] = useSearchParams();

    const [startNum, setStartNum] = useState<number | null>(null);
    const [middleNum, setMiddleNum] = useState<number | null>(null);
    const [currentPosition, setCurrentPosition] = useState<"start" | "middle">("start");
    const [percentage, setPercentage] = useState<number | null>(null);
    const [count, setCount] = useState(0);
    const [isCounting, setIsCounting] = useState(false);

    const [isStartingPositionCountdownPlaying, setIsStartingPositionCountdownPlaying] = useState(false);
    const [isMiddlePositionCountdownPlaying, setIsMiddlePositionCountdownPlaying] = useState(false);

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

    const startCalibration = () => {
        setIsStartingPositionCountdownPlaying(true);
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
        const calculatedPercentage = (num - startNum) / diff;

        // Ensuring the percentage stays between 0% and 100%
        return Math.max(0, Math.min(1, calculatedPercentage));
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
        <div className="flex flex-col items-start pl-32 justify-center min-h-screen p-4 bg-black text-white border">
            <h1 className="text-3xl font-semibold italic mb-4 text-orange-500">SOLO WORKOUT</h1>
            <div className="flex items-center justify-start">
                {/* Webcam */}
                <div className="mr-8">
                    <Webcam
                        ref={webcamRef}
                        width={320}
                        height={240}
                        videoConstraints={{
                            frameRate: { max: 30 },
                        }}
                        className="border-2 border-white rounded-lg"
                    />
                </div>

                {/* Rep Progress Indicator */}
                <div className="mr-8">
                    <RepProgressIndicator
                        startPercentage={workouts[workout].startPercentage}
                        middlePercentage={workouts[workout].middlePercentage}
                        currentPosition={currentPosition}
                        currentPercentage={percentage}
                        barColor="orange" // Updated color to orange
                    />
                </div>

                {/* Status and Count */}
                <div>
                    {/* Calibration/Position Status */}
                    {isStartingPositionCountdownPlaying && (
                        <CountdownCircleTimer
                            isPlaying={isStartingPositionCountdownPlaying}
                            duration={5}
                            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                            colorsTime={[7, 5, 2, 0]}
                            onComplete={() => {
                                setStartPosition();
                                setIsStartingPositionCountdownPlaying(false);
                                setIsMiddlePositionCountdownPlaying(true);
                            }}
                        >
                            {({ remainingTime }) => <div className="text-center">{remainingTime}</div>}
                        </CountdownCircleTimer>
                    )}

                    {isMiddlePositionCountdownPlaying && (
                        <CountdownCircleTimer
                            isPlaying={isMiddlePositionCountdownPlaying}
                            duration={3}
                            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                            colorsTime={[7, 5, 2, 0]}
                            onComplete={() => {
                                setDownPosition();
                                setIsMiddlePositionCountdownPlaying(false);
                                setIsCounting(true); // Automatically start counting after calibration
                            }}
                        >
                            {({ remainingTime }) => <div className="text-center">{remainingTime}</div>}
                        </CountdownCircleTimer>
                    )}

                    {!isStartingPositionCountdownPlaying && !isMiddlePositionCountdownPlaying && (
                        <div className="text-lg mb-4">Calibrated</div>
                    )}

                    {/* Selected Exercise */}
                    { searchParams.has("workout") && <div className="text-lg mb-4 text-orange-500">Exercise: {searchParams.get("workout")}</div> }

                    {/* Count */}
                    <div className="text-4xl font-bold">Count: {count} {searchParams.has("reps") ? `out of ${searchParams.get("reps")}`: ""}</div>
                </div>
            </div>

            {/* Start Calibration and Counting Buttons */}
            <div className="mt-8 flex space-x-4">
                <button
                    onClick={startCalibration}
                    className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                >
                    Start Calibration
                </button>

                <button
                    onClick={() => setIsCounting((prev) => !prev)}
                    className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                >
                    {isCounting ? 'Stop Counting' : 'Start Counting'}
                </button>
            </div>
        </div>
    );
}

export default Pose;
