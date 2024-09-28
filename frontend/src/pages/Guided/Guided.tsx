import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import workouts from "../../constants/workouts";
import Cookies from 'js-cookie';

interface WorkoutFlashcard {
  workout: string;
  reps: number;
  reason: string;
}

const WorkoutFlashcards: React.FC = () => {
  const [flashcards, setFlashcards] = useState<WorkoutFlashcard[]>([]);
  const [searchParams] = useSearchParams();
  const muscleGroup = searchParams.get("muscleGroup") || "Full Body";

  const getWorkoutFlashcards = async () => {
    const userId = Cookies.get('userId');

    const userResponse = await fetch(`http://localhost:3000/api/user/${userId}`);
    const userData = await userResponse.json();

    const prompt = `Generate five workout and 4 rest flashcards targeting the ${muscleGroup} muscle group, out of only these exercises: ${Object.keys(workouts).join(", ")}.     The user has these injuries: ${userData.injuries}, Wants the difficulty to be ${userData.difficulty}, and has these additional details: ${userData.details}. Generate Based on ALL THESE FACTORS. Higher Reps for Higher Difficulties, preferences. After each exercise, there will be rest.
in this format:
    [
      {
        "workout": "Overhead Press",
        "reps": 12,
        "reason": "The overhead press targets the shoulder muscles, specifically the deltoids. It is a key compound movement for shoulder development."
      },
      {
        "workout": "Lateral Raises",
        "reps": 15,
        "reason": "Lateral raises focus on the side deltoid, helping to widen and define the shoulder muscles."
      }
    ]
    Ensure that the JSON is valid and the workouts are appropriate for the ${muscleGroup}. Do not include any extra text or characters outside the array. If nothing matches, give pushups.`;
    console.log(prompt)
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
      const flashcardsArray = JSON.parse(cleanedResponse);
      setFlashcards(flashcardsArray);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  useEffect(() => {
    getWorkoutFlashcards();
  }, [muscleGroup]);

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {flashcards.map((card, index) => (
        <div
          key={index}
          className="w-64 p-4 border border-gray-400 rounded-md bg-white text-black"
        >
          <h2 className="text-xl font-bold mb-2">{card.workout}</h2>
          <p className="text-md">Reps: {card.reps}</p>
          <p className="text-sm mt-2">{card.reason}</p>
        </div>
      ))}
    </div>
  );
};

export default WorkoutFlashcards;
