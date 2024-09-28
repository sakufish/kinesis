import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from "@tensorflow/tfjs";
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
import workouts from '../constants/workouts';
import RepProgressIndicator from '../components/RepProgressIndicator';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useSearchParams } from 'react-router-dom';
import ReactConfetti from 'react-confetti';

import frame from './workout/assets/frame.png'; // Importing the frame image
import calibrate from './workout/assets/calibrate.svg'; // Importing icons
import CountICON from './workout/assets/count.svg';

const detectorConfig = {
    runtime: 'tfjs',
    modelType: 'SinglePose.Lightning',
    modelUrl: 'https://storage.googleapis.com/tfhub-tfjs-modules/google/tfjs-model/movenet/singlepose/lightning/4/model.json'
};

const Pose = () => {
    const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
    
    // Get workout and reps from searchParams
    const [searchParams, setSearchParams] = useSearchParams();
    const [workout, setWorkout] = useState(searchParams.get("workout") || "Pushups");
    const [reps, setReps] = useState<number>(searchParams.has("reps") ? parseInt(searchParams.get("reps")!) : 10);

    const [startNum, setStartNum] = useState<number | null>(null);
    const [middleNum, setMiddleNum] = useState<number | null>(null);
    const [currentPosition, setCurrentPosition] = useState<"start" | "middle">("start");
    const [currentPosturePosition, setCurrentPosturePosition] = useState<"good" | "bad">("good");
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

    const getPosture = async () => {
        const poses = await getPoses();
        if (!poses) {
            return null;
        }

        const workoutConfig = workouts[workout];
        const posture = workoutConfig.postureFunction(poses[0]);

        return posture;
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
    
    useEffect(() => {
        let postureMeasurements: { status: "good" | "bad"; message?: string }[] = [];

        const interval = setInterval(() => {
            if (!isCounting) {
                return;
            }

            getPosture().then((posture) => {
                if (!posture) {
                    return;
                }

                postureMeasurements.push(posture);

                if (postureMeasurements.length >= 20) {
                    const badCount = postureMeasurements.filter(p => p.status === "bad").length;
                    const goodCount = postureMeasurements.filter(p => p.status === "good").length;

                    const majorityPosture = badCount > goodCount ? "bad" : "good";
                    const majorityMessage = postureMeasurements.find(p => p.status === majorityPosture)?.message || "";

                    console.log({ status: majorityPosture, message: majorityMessage });

                    

                    if (majorityPosture === "bad" && currentPosturePosition === "good") {
                        console.log("bad");
                        setCurrentPosturePosition("bad");
                        const msg = new SpeechSynthesisUtterance(majorityMessage);
                        msg.lang = 'en-US';
                        msg.rate = 1.5;
                        window.speechSynthesis.speak(msg);
                    } else if (majorityPosture === "good" && currentPosturePosition === "bad") {
                        setCurrentPosturePosition("good");
                        const msg = new SpeechSynthesisUtterance("Good job!");
                        msg.lang = 'en-US';
                        msg.rate = 1.5;
                        window.speechSynthesis.speak(msg);
                    }

                    postureMeasurements = [];
                }
            });
        }, 100);

        return () => clearInterval(interval);
    }, [detector, currentPosturePosition, isCounting]);

    useEffect(() => {
        if (count >= reps) {
            setIsCounting(false);
        }
    }, [count, reps]);

    return (
        <div className="flex flex-col items-start pl-32 justify-center min-h-screen p-4 bg-black text-white">
            {count >= reps && <ReactConfetti colors={["#004777", "#F7B801", "#A30000"]} recycle={false} numberOfPieces={500} />}
            
            <h1 className="text-3xl font-semibold italic mb-4 text-orange-500">SOLO WORKOUT</h1>
            
            <div className="flex items-center justify-center relative">
                
                {/* Frame Image Larger than Webcam */}
                <div className="flex flex-col justify-center items-center relative w-[30rem] h-full">
                    {/* Frame */}
                    <div className="absolute top-0 left-0 transform z-10">
                        <img
                            src={frame}
                            alt="Frame"
                            className="w-full h-auto" // Larger dimensions for the frame
                        />
                    </div>

                    {/* Webcam */}
                    <Webcam
                        ref={webcamRef}
                        width={450}
                        height={0}
                        videoConstraints={{
                            frameRate: { max: 30 },
                        }}
                        className="rounded-md relative z-20 mt-4" // Positioned within the larger frame
                    />

                    {/* Buttons */}
                    <div className="mt-8 flex space-x-4 z-10">
                        <button
                            onClick={startCalibration}
                            className="flex flex-row justify-center items-center"
                        >
                            <img src={calibrate} alt="Calibrate" className='w-4 h-auto mr-1' />
                            Start Calibration
                        </button>

                        <button
                            onClick={() => setIsCounting((prev) => !prev)}
                            className="flex flex-row justify-center items-center"
                        >                            
                            <img src={CountICON} alt="Count" className='w-4 h-auto mr-1'/>
                            {isCounting ? 'Stop Counting' : 'Start Counting'}
                        </button>
                    </div>
                </div>

                {/* Rep Progress Indicator */}
                <div className="ml-8">
                    <RepProgressIndicator
                        startPercentage={workouts[workout].startPercentage}
                        middlePercentage={workouts[workout].middlePercentage}
                        currentPosition={currentPosition}
                        currentPercentage={percentage}
                        barColor="orange"
                    />
                </div>

                {/* Status and Count */}
                <div className="ml-8">
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
                    <div className="text-lg mb-4 text-orange-500">Exercise: {workout}</div>

                    {/* Count */}
                    <div className="text-4xl font-bold">Count: {count} / {reps}</div>
                </div>
            </div>
        </div>
    );
}

export default Pose;
