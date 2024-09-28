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

    const prompt = `Generate five workout flashcards targeting ${muscleGroup} using only these exercises: ${Object.keys(workouts).join(", ")}. If ${userData.difficulty} is easy, below 10 reps, if medium, below 18 reps, if hard, below 30 reps. More reps for higher difficulty.
The user has these additional details: ${userData.details}. After each exercise block, add rest periods of varying time based on difficulty. The user has the following injuries: ${userData.injuries.join(",")}
in this format:
[
  {
    "workout": "Squats",
    "reps": 20
  },
  {
    "workout": "Pushups",
    "reps": 20,
    "rest": 30
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
      console.log(response)
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
