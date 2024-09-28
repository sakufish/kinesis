const Guided = () => {
    return (
        <div>
            <h1>Guided</h1>
            <button onClick={() => {
                fetch('http://localhost:5000/api/gemini', {
                    mode: 'no-cors',
                    body: JSON.stringify({
                        prompt: "I want to target my legs. From the following workouts, ",
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }).then(res => res.json()).then(data => {
                    console.log(data);
                });
            }}>Legs</button>
        </div>
    );
};

export default Guided;