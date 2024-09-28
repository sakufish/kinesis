import * as poseDetection from "@tensorflow-models/pose-detection";

const workouts: {
    [key: string]: {
        startPercentage: number,
        middlePercentage: number,
        function: (pose: poseDetection.Pose) => number,
        postureFunction: (pose: poseDetection.Pose) => any,
    }
} = {
    "Pushups": {
        startPercentage: 0.2,
        middlePercentage: 0.7,
        function: (pose) => {
            const leftShoulderY = pose.keypoints[5].y;
            const rightShoulderY = pose.keypoints[6].y;

            const shoulderY = (leftShoulderY + rightShoulderY) / 2;

            return shoulderY; 
        },
    }
};

export default workouts;