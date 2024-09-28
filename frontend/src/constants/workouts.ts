import * as poseDetection from "@tensorflow-models/pose-detection";

const getAngle = (p1, p2, p3, flipped) => {
    // Vector 1 from point p2 to point p1
    const v1x = p1.x - p2.x;
    const v1y = p1.y - p2.y;
  
    // Vector 2 from point p2 to point p3
    const v2x = p3.x - p2.x;
    const v2y = p3.y - p2.y;
  
    // Dot product of vectors
    const dotProduct = v1x * v2x + v1y * v2y;
  
    // Magnitude of vectors
    const magV1 = Math.sqrt(v1x * v1x + v1y * v1y);
    const magV2 = Math.sqrt(v2x * v2x + v2y * v2y);
  
    // Calculate the angle in radians
    const angleRad = Math.acos(dotProduct / (magV1 * magV2));
  
    // Convert to degrees
    let angleDeg = angleRad * (180 / Math.PI);
  
    // Use atan2 to get the angle's correct sign and quadrant
    const crossProduct = v1x * v2y - v1y * v2x;
    const angle360 = Math.atan2(crossProduct, dotProduct) * (180 / Math.PI);
  
    // Adjust the angle to be between 0 and 360 degrees
    if (angle360 < 0) {
      angleDeg = 360 + angle360;
    } else {
      angleDeg = angle360;
    }

    if (flipped) {
        angleDeg = 360 - angleDeg;
    }
  
    return angleDeg;
  }

const workouts: {
    [key: string]: {
        startPercentage: number,
        middlePercentage: number,
        function: (pose: poseDetection.Pose) => number,
        postureFunction: (pose: poseDetection.Pose) => {
            status: "good" | "bad",
            message?: string,
        }
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
        postureFunction: (pose) => {
            const leftShoulder = pose.keypoints[5];
            const rightShoulder = pose.keypoints[6];
            const leftHip = pose.keypoints[11];
            const rightHip = pose.keypoints[12];
            const leftKnee = pose.keypoints[13];
            const rightKnee = pose.keypoints[14];

            const avgShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };
            const avgHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 };
            const avgKnee = { x: (leftKnee.x + rightKnee.x) / 2, y: (leftKnee.y + rightKnee.y) / 2 };

            const flipped = avgShoulder.x < avgHip.x;

            const shoulderHipAngle = getAngle(avgShoulder, avgHip, avgKnee, flipped);

            if (shoulderHipAngle < 140) {
                return {
                    status: "bad",
                    message: "Your hips are too high. Make sure your body is in a straight line."
                }
            } else if (shoulderHipAngle > 200) {
                return {
                    status: "bad",
                    message: "Your hips are too low. Make sure your body is in a straight line."
                }
            } else {
                return {
                    status: "good",
                }
            }
        }
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
        postureFunction: (pose) => {
            const leftHip = pose.keypoints[11];
            const rightHip = pose.keypoints[12];
            const leftShoulder = pose.keypoints[5];
            const rightShoulder = pose.keypoints[6];

            const avgHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 };
            const avgShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };

            const flipped = avgHip.x < avgShoulder.x;

            const hipShoulderAngle = getAngle({ x: avgHip.x, y: 0 }, avgHip, avgShoulder, flipped);

            console.log(hipShoulderAngle);

            if (hipShoulderAngle < 330) {
                return {
                    status: "bad",
                    message: "You're leaning forward too much. Make sure to keep your back straight."
                }
            } else {
                return {
                    status: "good",
                }
            }
        }
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
        postureFunction: (pose) => {
            const leftHip = pose.keypoints[11];
            const rightHip = pose.keypoints[12];
            const leftShoulder = pose.keypoints[5];
            const rightShoulder = pose.keypoints[6];

            const avgHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 };
            const avgShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };

            const flipped = avgHip.x < avgShoulder.x;

            const hipShoulderAngle = getAngle({ x: avgHip.x, y: 0 }, avgHip, avgShoulder, flipped);

            if (hipShoulderAngle < 330) {
                return {
                    status: "bad",
                    message: "You're leaning forward too much. Make sure to keep your back straight."
                }
            } else {
                return {
                    status: "good",
                }
            }
        }
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
        postureFunction: (pose) => {
            return {
                status: "good",
            }
        }
    },
    "High Knees": {
        startPercentage: 0.2,
        middlePercentage: 0.7,
        function: (pose) => {
            const leftKneeY = pose.keypoints[13].y;

            return leftKneeY;
        },
        postureFunction: (pose) => {
            const leftHip = pose.keypoints[11];
            const rightHip = pose.keypoints[12];
            const leftShoulder = pose.keypoints[5];
            const rightShoulder = pose.keypoints[6];

            const avgHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 };
            const avgShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };

            const flipped = avgHip.x < avgShoulder.x;

            const hipShoulderAngle = getAngle({ x: avgHip.x, y: 0 }, avgHip, avgShoulder, flipped);

            if (hipShoulderAngle < 330) {
                return {
                    status: "bad",
                    message: "You're leaning forward too much. Make sure to keep your back straight."
                }
            } else {
                return {
                    status: "good",
                }
            }
        }
    },
    "Lateral Lunges": {
        startPercentage: 0.2,
        middlePercentage: 0.7,
        function: (pose) => {
            const leftHipX = pose.keypoints[11].x;
            const rightHipX = pose.keypoints[12].x;

            const hipX = (leftHipX + rightHipX) / 2;

            return hipX;
        },
        postureFunction: (pose) => {
            const leftHip = pose.keypoints[11];
            const rightHip = pose.keypoints[12];
            const leftShoulder = pose.keypoints[5];
            const rightShoulder = pose.keypoints[6];

            const avgHip = { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 };
            const avgShoulder = { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 };

            const flipped = avgHip.x < avgShoulder.x;

            const hipShoulderAngle = getAngle({ x: avgHip.x, y: 0 }, avgHip, avgShoulder, flipped);

            if (hipShoulderAngle < 330) {
                return {
                    status: "bad",
                    message: "You're leaning too much. Make sure to keep your back straight."
                }
            } else {
                return {
                    status: "good",
                }
            }
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
        postureFunction: (pose) => {
            return {
                status: "good",
            }
        }
    },
};

export default workouts;