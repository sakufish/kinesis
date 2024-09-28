import * as poseDetection from '@tensorflow-models/pose-detection';

const Pose = () => {
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);

    return (
        <div>
            <h1>Pose Detection</h1>
        </div>
    )
}

export default Pose;