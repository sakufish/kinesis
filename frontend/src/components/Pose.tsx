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
                scoreThreshold: 0.6
            });
            console.log(poses);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getPoses();
        }, 100);

        return () => clearInterval(interval);
    }, [detector]);

    return (
        <div>
            <h1>Pose Detection</h1>
            <Webcam ref={webcamRef} videoConstraints={{
                frameRate: { max: 30 },
            }}/>
        </div>
    )
}

export default Pose;