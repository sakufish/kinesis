import { useState } from "react";
import Workout from "../../types/Workout";

const Guided = () => {
    const [workout, setWorkout] = useState<Workout | null>(null);

    const getWorkout = async () => {
        const response = await fetch('http://localhost:3000/api/gemini', {
            body: JSON.stringify({
                prompt: `I want to target the following muscle group: ${"Arms"}. I have the following injuries: ${"Ankle"}. Choose a workout from the following: ${"Pushups, Squats, Lunges, Arm Curls"}, and the number of reps, and a reason for why relating it to how it targets the muscle group as well as how it doesn't interfere with the injury. Reps should be a single number. Respond in the following JSON format, without \`\`\`json, etc.:
                {
                    "workout": "Squats",
                    "reps": 10,
                    "reason": "Squats are a great workout for the legs because they target the quads, hamstrings, and glutes. They don't interfere with your shoulder injury because they don't require any shoulder movement. 10 reps is a good starting point for beginners."
                }`
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        const data = await response.json();
        const rawWorkout = data.description;

        try {
            const workout = JSON.parse(rawWorkout);
            setWorkout(workout);
        } catch(e) {
            console.error(e);
        }
    };

    return (
        <div>
            <h1>Guided</h1>
            <button onClick={getWorkout}>Legs</button>

            <br />

            {workout && (
                <div>
                    <h2>Workout: {workout.workout}</h2>
                    <p>Reps: </p>
                    <input type="number" value={workout.reps} onChange={(e) => {
                        const reps = parseInt(e.target.value);
                        setWorkout({
                            ...workout,
                            reps
                        });
                    }} />
                    <p>Reason: {workout.reason}</p>
                    <button onClick={() => {
                        window.location.href = '/pose?workout=' + workout.workout + '&reps=' + workout.reps;
                    }}>Continue</button>
                </div>
            )}
        </div>
    );
};

export default Guided;