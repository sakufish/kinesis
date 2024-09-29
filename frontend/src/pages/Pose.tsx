import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from "@tensorflow/tfjs";
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
import workouts from '../constants/workouts';
import RepProgressIndicator from '../components/RepProgressIndicator';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useSearchParams } from 'react-router-dom';
import ReactConfetti from 'react-confetti';

import frame from './workout/assets/frame.png';
import calibrate from './workout/assets/calibrate.svg';
import CountICON from './workout/assets/count.svg';

const detectorConfig = {
    runtime: 'tfjs',
    modelType: 'SinglePose.Lightning',
    modelUrl: 'https://storage.googleapis.com/tfhub-tfjs-modules/google/tfjs-model/movenet/singlepose/lightning/4/model.json'
};

const Pose = () => {
    const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
    const [searchParams] = useSearchParams();

    const exercises = searchParams.getAll("workout");
    const repsList = searchParams.getAll("reps").map((rep) => parseInt(rep));
    const restTimes = searchParams.getAll("rest").map((rest) => parseInt(rest));

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [workout, setWorkout] = useState(exercises[currentStepIndex] || "Pushups");
    const [reps, setReps] = useState(repsList[currentStepIndex] || 10);
    const [restTime, setRestTime] = useState(restTimes[currentStepIndex] || 0);
    const [isResting, setIsResting] = useState(false);

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
    };

    const getPosition = async () => {
        const poses = await getPoses();
        if (!poses) {
            return null;
        }

        const workoutConfig = workouts[workout];
        const num = workoutConfig.function(poses[0]);

        return num;
    };

    const setStartPosition = async () => {
        const num = await getPosition();
        if (num) {
            setStartNum(num);
        }
    };

    const setDownPosition = async () => {
        const num = await getPosition();
        if (num) {
            setMiddleNum(num);
        }
    };

    const startCalibration = () => {
        setIsStartingPositionCountdownPlaying(true);
    };

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

        return Math.max(0, Math.min(1, calculatedPercentage));
    };

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
        if (count >= reps) {
            setIsCounting(false);
            setCount(0);
            moveToNextStep();
        }
    }, [count, reps]);

    const moveToNextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < exercises.length + restTimes.length) {
            setCurrentStepIndex(nextIndex);

            if (nextIndex % 2 === 1) {
                setRestTime(restTimes[Math.floor(nextIndex / 2)]);
                setIsResting(true);
            } else {
                setWorkout(exercises[Math.floor(nextIndex / 2)]);
                setReps(repsList[Math.floor(nextIndex / 2)]);
                setIsResting(false);
                setCount(0);
                setPercentage(null);
                setCurrentPosition("start");
                setStartNum(null);
                setMiddleNum(null);
            }
        }
    };

    const handleRestComplete = () => {
        setIsResting(false);
        moveToNextStep();
    };

    return (
        <div className="flex min-h-screen p-4 bg-black justify-center items-center text-white relative">
            {count >= reps && !isResting && <ReactConfetti colors={["#004777", "#F7B801", "#A30000"]} recycle={false} numberOfPieces={500} />}
            
            {isResting ? (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-3xl font-semibold italic mb-4 text-orange-500">Rest Time</h1>
                    <CountdownCircleTimer
                        isPlaying
                        duration={restTime}
                        colors={['#f7963b', '#F7B801', '#A30000', '#A30000']}
                        colorsTime={[7, 5, 2, 0]}
                        onComplete={handleRestComplete}
                    >
                        {({ remainingTime }) => <div className="text-4xl">{remainingTime}s</div>}
                    </CountdownCircleTimer>
                </div>
            ) : (
                <div className="flex-grow">
                    <div className="flex flex-col items-start pl-32 justify-center">
                        <h1 className="text-3xl font-semibold italic mb-4 text-orange-500">SOLO WORKOUT</h1>
                        
                        <div className="flex items-center justify-center relative">
                            
                            <div className="flex flex-col justify-center items-center relative w-[30rem] h-full">
                                
                                <div className="absolute top-0 left-0 transform z-10">
                                    <img
                                        src={frame}
                                        alt="Frame"
                                        className="w-full h-auto"
                                    />
                                </div>

                                <div className="relative">
                                    <Webcam
                                        ref={webcamRef}
                                        width={450}
                                        height={0}
                                        videoConstraints={{
                                            frameRate: { max: 30 },
                                        }}
                                        className="rounded-md relative z-20 mt-4"
                                    />
                                    {isStartingPositionCountdownPlaying && (
                                        <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center z-30 bg-black/10">
                                            <span className='text-3xl font-bold' style={{
                                                textShadow: '0 0 10px #000'
                                            }}>Resting Position</span>
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
                                                {({ remainingTime }) => <div className="text-center text-6xl">{remainingTime}</div>}
                                            </CountdownCircleTimer>
                                        </div>
                                    )}

                                    {isMiddlePositionCountdownPlaying && (
                                        <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center z-30 bg-black/10">
                                            <span className='text-3xl font-bold' style={{
                                                textShadow: '0 0 10px #000'
                                            }}>Active Position</span>
                                            <CountdownCircleTimer
                                                isPlaying={isMiddlePositionCountdownPlaying}
                                                duration={5}
                                                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                                                colorsTime={[7, 5, 2, 0]}
                                                onComplete={() => {
                                                    setDownPosition();
                                                    setIsMiddlePositionCountdownPlaying(false);
                                                    setIsCounting(true);
                                                }}
                                            >
                                                {({ remainingTime }) => <div className="text-center text-6xl">{remainingTime}</div>}
                                            </CountdownCircleTimer>
                                        </div>
                                    )}
                                </div>

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
                                        disabled={!startNum || !middleNum}
                                        style={{ opacity: !startNum || !middleNum ? 0.5 : 1 }}
                                    >                            
                                        <img src={CountICON} alt="Count" className='w-4 h-auto mr-1'/>
                                        {isCounting ? 'Stop Counting' : 'Start Counting'}
                                    </button>
                                </div>
                            </div>

                            <div className="ml-8">
                                <RepProgressIndicator
                                    startPercentage={workouts[workout].startPercentage}
                                    middlePercentage={workouts[workout].middlePercentage}
                                    currentPosition={currentPosition}
                                    currentPercentage={percentage}
                                    barColor="orange"
                                />
                            </div>

                            <div className="ml-8">
                                <div className="text-4xl mb-4 text-orange-500">{workout}</div>

                                <div className='font-bold text-4xl'>
                                    <span className='text-8xl'>{count}</span>
                                    <span className='italic'> / {reps}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/4 bg-neutral-900 text-white p-4 m-10 right-0 top-0 h-auto rounded-lg fixed">
                        <h2 className="text-2xl font-semibold italic mb-4">UPCOMING STEPS</h2>
                        <ul>
                            {Array.from({ length: exercises.length + restTimes.length - currentStepIndex - 1 }).map((_, index) => {
                                const stepIndex = currentStepIndex + 1 + index;
                                return stepIndex % 2 === 1 ? (
                                    <li key={index} className="mb-2">
                                        <div className="text-sm italic">🌱 Rest - {restTimes[Math.floor(stepIndex / 2)]}s</div>
                                    </li>
                                ) : (
                                    <li key={index} className="mb-2">
                                        <div className="text-sm italic">{exercises[Math.floor(stepIndex / 2)]} - {repsList[Math.floor(stepIndex / 2)]} reps</div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pose;
