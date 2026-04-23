async function testGroq() {

    console.log("Testing generateOpeningMessage...");
    const opening = await generateOpeningMessage({
        candidateName: "Md Aman",
        jobTitle: "Software Developer Intern at Tech Solutions",
        resume: `
            Name: Md Aman
            Skills: Node.js, Express.js, MongoDB, JavaScript
            Projects: Video Calling App using WebRTC, Interview AI Platform using Gemini API
            DSA: 300+ problems solved
        `
    });
    console.log("Opening Message:", opening.message);
    console.log("First Question:", opening.firstQuestion);

    console.log("\nTesting evaluateAnswer...");
    const evaluation = await evaluateAnswer({
        question: "Tell me about your Video Calling App project",
        userAnswer: "I built it using WebRTC for peer to peer video and Socket.io for signaling between users",
        jobTitle: "Software Developer Intern"
    });
    console.log("Score:", evaluation.score);
    console.log("Feedback:", evaluation.feedback);
    console.log("Ideal Answer:", evaluation.idealAnswer);
    console.log("Next Question:", evaluation.nextQuestion);
}

testGroq().catch(console.error);