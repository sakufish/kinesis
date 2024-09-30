import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import workouts from "../../constants/workouts";
import Cookies from 'js-cookie';
import BG from '../solo/assets/SOLObg.png';

interface WorkoutLink {
    workout: string;
    reps: number;
    rest?: number;
    reason: string;
}

const WorkoutRedirect: React.FC = () => {
    const [searchParams] = useSearchParams();
    const muscleGroup = searchParams.get("muscleGroup") || "Full Body";

    const [workoutLinks, setWorkoutLinks] = useState<WorkoutLink[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // For determining direction of animation

    const nextWorkout = () => {
        if (currentIndex < workoutLinks.length - 1) {
            setDirection(1); // Indicating forward motion
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const previousWorkout = () => {
        if (currentIndex > 0) {
            setDirection(-1); // Indicating backward motion
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };

    const goNext = () => {
        let queryString = workoutLinks.map(workoutLink =>
            `workout=${encodeURIComponent(workoutLink.workout)}&reps=${workoutLink.reps}${workoutLink.rest ? `&rest=${workoutLink.rest}` : ''}`
        ).join('&');

        const workoutPageUrl = `/pose?${queryString}`;
        window.location.href = workoutPageUrl;
    };

    const generateWorkoutLink = async () => {
        const userId = Cookies.get('userId');
        const userResponse = await fetch(`https://kinesis-14vq.onrender.com/api/user/${userId}`);
        const userData = await userResponse.json();

        const prompt = `Generate a workout plan for me targeting ${muscleGroup} using only these exercises: ${Object.keys(workouts).join(", ")}. 
Adjust the number of reps and rest times according to the desired difficulty level [${userData.difficulty}] as follows:
- If my difficulty is "Easy", use lower reps (10-15) and longer rest periods (60-90 seconds).
- If my difficulty is "Medium", use moderate reps (15-20) and moderate rest periods (30-60 seconds).
- If my difficulty is "Hard", use higher reps (20-30) and shorter rest periods (15-30 seconds).

I have the following injuries: ${userData.injuries.join(",")}. If none are listed, ignore. Modify the exercises as necessary to avoid strain on my injured areas. 
I also provided the following additional details: ${userData.details}. If none are listed, ignore. After each exercise block, include a rest period based on the difficulty of the exercise.

ONLY GENERATE ONE WORKOUT PLAN. 

For your reasoning for each exercise, include the following in a casual form:
- A unique description of the exercise.
- Why the exercise targets the ${muscleGroup}.
- How the exercise doesn't strain my injuries, if applicable.
- How the exercise aligns with my additional details, if applicable.

Use this format for the output:
[
  {
    "workout": "Squats",
    "reps": rep_number,
    "rest": second_count,
    "reason": reason_text
  },
  {
    "workout": "Pushups",
    "reps": rep_number,
    "rest": second_count,
    "reason": reason_text
  }
]

Ensure that the JSON is valid and appropriate for the ${muscleGroup}. Do not include any extra text or characters outside the array.`;

        try {
            const response = await fetch('https://kinesis-14vq.onrender.com/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();
            const rawResponse = data.description;
            const cleanedResponse = rawResponse.trim();
            const workoutLinks: WorkoutLink[] = JSON.parse(cleanedResponse);

            setWorkoutLinks(workoutLinks);
        } catch (error) {
            console.error('Error generating workout link:', error);
        }
    };

    useEffect(() => {
        generateWorkoutLink();
    }, [muscleGroup]);

    // Animation variants for sliding motion
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeInOut" },
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            transition: { duration: 0.3, ease: "easeInOut" },
        }),
    };

    return (
        <div
            className="relative h-screen text-white p-8 flex flex-col items-center justify-center overflow-x-hidden"
            style={{
                backgroundImage: `url(${BG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-black opacity-85 z-0"></div>
            <div className="relative z-10 w-full max-w-2xl text-center">
                <h1 className="text-white text-5xl font-bold italic mb-10">OVERVIEW</h1>

                {workoutLinks.length === 0 ? (
                    <p>Loading...</p>
                ) : (
                    <div className="relative w-full h-64">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="absolute w-full h-full"
                            >
                                <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg">
                                    <h2 className="text-3xl mb-4 text-[#FF833A]">
                                        {currentIndex + 1}. {workoutLinks[currentIndex].workout}
                                    </h2>
                                    <p className="text-lg">
                                        <span className="font-bold">Reps: </span>
                                        {workoutLinks[currentIndex].reps}
                                    </p>
                                    <p className="text-lg">
                                        <span className="font-bold">Rest: </span>
                                        {workoutLinks[currentIndex].rest} seconds
                                    </p>
                                    <p className="text-md mt-4">{workoutLinks[currentIndex].reason}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}

                <div className="flex mt-10 justify-between">
                    {currentIndex !== 0 ? (
                        <button
                            onClick={previousWorkout}
                            className="px-4 py-2 bg-[#1E1E1E] border border-white text-white rounded-md glassmorphism shadow-lg transition duration-200 hover:bg-orange-500 hover:border-orange-500"
                        >
                            ←
                        </button>
                    ) : (
                        <div></div>
                    )}
                    {currentIndex !== workoutLinks.length - 1 ? (
                        <button
                            onClick={nextWorkout}
                            className="px-4 py-2 bg-[#1E1E1E] border border-white text-white rounded-md glassmorphism shadow-lg transition duration-200 hover:bg-orange-500 hover:border-orange-500"
                        >
                            →
                        </button>
                    ) : (
                        <div></div>
                    )}
                </div>

                <button
                    onClick={goNext}
                    className="mt-10 px-8 py-2 bg-[#FF833A] text-black font-bold rounded-lg hover:bg-orange-600 transition duration-300"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default WorkoutRedirect;