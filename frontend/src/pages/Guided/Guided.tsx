import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import workouts from "../../constants/workouts";
import Cookies from 'js-cookie';

interface WorkoutLink {
  workout: string;
  reps: number;
  rest?: number; 
}

const WorkoutRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const muscleGroup = searchParams.get("muscleGroup") || "Full Body";

  const generateWorkoutLink = async () => {
    const userId = Cookies.get('userId');
    const userResponse = await fetch(`http://localhost:3000/api/user/${userId}`);
    const userData = await userResponse.json();

    const prompt = `Generate a workout plan targeting ${muscleGroup} using only these exercises: ${Object.keys(workouts).join(", ")}. 
Adjust the number of reps and rest times according to the desired difficulty level [${userData.difficulty}] as follows:
- For "Easy", use lower reps (10-15) and longer rest periods (60-90 seconds).
- For "Medium", use moderate reps (15-20) and moderate rest periods (45-60 seconds).
- For "Hard", use higher reps (20-30) and shorter rest periods (30-45 seconds).

The user has the following injuries: ${userData.injuries.join(",")}.If none are listed, ignore. Modify the exercises as necessary to avoid strain on injured areas. 
The user provided the following additional details: ${userData.details}.If none are listed, ignore. After each exercise block, include a rest period based on difficulty.

ONLY GENERATE ONE WORKOUT PLAN. 

Use this format for the output:
[
  {
    "workout": "Squats",
    "reps": rep_number,
    "rest": second_count
  },
  {
    "workout": "Pushups",
    "reps": rep_number,
    "rest": second_count
  }
]

Ensure that the JSON is valid and appropriate for the ${muscleGroup}. Do not include any extra text or characters outside the array. do not include backticks, or anything. Just the array`;

    try {
      const response = await fetch('http://localhost:3000/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log(data.description)
      const rawResponse = data.description;
      const cleanedResponse = rawResponse.trim();
      const workoutLinks: WorkoutLink[] = JSON.parse(cleanedResponse);

      let queryString = '';
      workoutLinks.forEach((workoutLink, index) => {
        queryString += `workout=${encodeURIComponent(workoutLink.workout)}&reps=${workoutLink.reps}`;
        if (workoutLink.rest) {
          queryString += `&rest=${workoutLink.rest}`;
        }
        if (index < workoutLinks.length - 1) {
          queryString += '&';
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
