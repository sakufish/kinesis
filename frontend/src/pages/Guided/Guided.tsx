import React, { useState, useEffect } from "react";

// Define the Flashcard type for workouts
interface WorkoutFlashcard {
  workout: string;
  reps: number;
  reason: string;
}

const WorkoutFlashcards: React.FC = () => {
  const [flashcards, setFlashcards] = useState<WorkoutFlashcard[]>([]); // Array to store workout flashcards

  // Fetch workout flashcards from Gemini API
  const getWorkoutFlashcards = async () => {
    const prompt = `Generate five workout flashcards in this format:
    [
      {
        "workout": "Squats",
        "reps": 10,
        "reason": "Squats are a great workout for the legs because they target the quads, hamstrings, and glutes. They don't interfere with your shoulder injury because they don't require any shoulder movement."
      },
      {
        "workout": "Pushups",
        "reps": 15,
        "reason": "Pushups are a great upper body workout targeting the chest, triceps, and shoulders. They avoid strain on the lower back."
      }
    ]
    Ensure that the JSON is valid. Do not include any extra text or characters outside the array.`;
    
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

      // Clean up response by removing potential unwanted characters
      const cleanedResponse = rawResponse.trim();

      // Parse the cleaned JSON response safely
      const flashcardsArray = JSON.parse(cleanedResponse);
      setFlashcards(flashcardsArray);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  useEffect(() => {
    getWorkoutFlashcards(); // Fetch flashcards on component mount
  }, []);

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
