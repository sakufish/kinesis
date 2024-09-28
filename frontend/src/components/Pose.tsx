import * as poseDetection from '@tensorflow-models/pose-detection';
import Webcam from 'react-webcam';

import { useEffect, useState } from 'react';

const Pose = () => {
    const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
    
    useEffect(() => {
        poseDetection.createDetector(poseDetection.SupportedModels.MoveNet).then((poseDetector) => {
            setDetector(poseDetector);
        });
    }, []);

    return (
        <div>
            <h1>Pose Detection</h1>
            <Webcam />
        </div>
    )
}

export default Pose;