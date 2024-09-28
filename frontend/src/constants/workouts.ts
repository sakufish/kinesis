import * as poseDetection from "@tensorflow-models/pose-detection";

const workouts: {
    [key: string]: {
        startPercentage: number,
        middlePercentage: number,
        function: (pose: poseDetection.Pose) => number,
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
    },
    "Squats": {
        startPercentage: 0.2,
        middlePercentage: 0.7,
        function: (pose) => {
            const leftHipY = pose.keypoints[11].y;
            const rightHipY = pose.keypoints[12].y;

            const hipY = (leftHipY + rightHipY) / 2;

            return hipY;
        },
    },
    "Lunges": {
        startPercentage: 0.2,
        middlePercentage: 0.7,
        function: (pose) => {
            const leftHipY = pose.keypoints[11].y;
            const rightHipY = pose.keypoints[12].y;

            const hipY = (leftHipY + rightHipY) / 2;

            return hipY;
        },
    },
    "Glute Bridges": {
        startPercentage: 0.2,
        middlePercentage: 0.7,
        function: (pose) => {
            const leftHipY = pose.keypoints[11].y;
            const rightHipY = pose.keypoints[12].y;

            const hipY = (leftHipY + rightHipY) / 2;

            return hipY;
        },
    },
    "High Knees": {
        startPercentage: 0.2,
        middlePercentage: 0.7,
        function: (pose) => {
            const leftKneeY = pose.keypoints[13].y;

            return leftKneeY;
        },
    },
    "Lateral Lunges": {
        startPercentage: 0.2,
        middlePercentage: 0.7,
        function: (pose) => {
            const leftHipX = pose.keypoints[11].x;
            const rightHipX = pose.keypoints[12].x;

            const hipX = (leftHipX + rightHipX) / 2;

            return hipX;
        }
    },
    "Sit Ups": {
        startPercentage: 0.2,
        middlePercentage: 0.7,
        function: (pose) => {
            const leftShoulderY = pose.keypoints[5].y;
            const rightShoulderY = pose.keypoints[6].y;

            const shoulderY = (leftShoulderY + rightShoulderY) / 2;

            return shoulderY;
        },
    },
};

export default workouts;