import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import workouts from "../../constants/workouts";
import Cookies from 'js-cookie';

interface WorkoutLink {
  workout: string;
  reps: number;
}

const WorkoutRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const muscleGroup = searchParams.get("muscleGroup") || "Full Body";

  const generateWorkoutLink = async () => {
    const userId = Cookies.get('userId');
    const userResponse = await fetch(`http://localhost:3000/api/user/${userId}`);
    const userData = await userResponse.json();

    const prompt = `Generate five workout flashcards targeting the ${muscleGroup} muscle group, out of only these exercises: ${Object.keys(workouts).join(", ")}. The user has these injuries: ${userData.injuries}, wants the difficulty to be ${userData.difficulty}, and has these additional details: ${userData.details}. Generate based on ALL THESE FACTORS. Higher reps for higher difficulties, preferences. After each exercise block, add rest periods of varying time.
in this format:
[
  {
    "workout": "Squats",
    "reps": 10
  },
  {
    "workout": "Pushups",
    "reps": 15,
    "rest": 60
  }
]
Ensure that the JSON is valid and the workouts are appropriate for the ${muscleGroup}. Do not include any extra text or characters outside the array.`;

    console.log(prompt);

    try {
      const response = await fetch('http://localhost:3000/api/gemini', {
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

      // Construct URL with workout and reps, adding rest once between exercises
      let queryString = '';
      workoutLinks.forEach((workoutLink, index) => {
        queryString += `workout=${encodeURIComponent(workoutLink.workout)}&reps=${workoutLink.reps}`;
        if (index < workoutLinks.length - 1) {
          queryString += `&rest=60&`;
        }
      });

      const workoutPageUrl = `/pose?${queryString}`;

      // Redirect to the workout page
      window.location.href = workoutPageUrl;

    } catch (error) {
      console.error('Error generating workout link:', error);
    }
  };

  useEffect(() => {
    generateWorkoutLink();
  }, [muscleGroup]);

  return (
    <div className="text-center text-white">
      <p>Redirecting to your workout...</p>
    </div>
  );
};

export default WorkoutRedirect;
