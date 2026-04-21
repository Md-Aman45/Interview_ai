const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});





const MODELS = [
    "llama-3.3-70b-versatile",   // best quality
    "llama-3.1-8b-instant",      // fast fallback
]






async function evaluateAnswer({ question, userAnswer, jobTitle }) {

    const prompt = `
                    You are a strict but fair technical interviewer for a "${jobTitle}" role.

                    The candidate was asked:
                    "${question}"

                    The candidate answered:
                    "${userAnswer}"

                    Evaluate honestly and respond ONLY with valid JSON:
                    {
                    "score": <number 0-10>,
                    "feedback": "<2-3 sentences: what was good and what was missing>",
                    "idealAnswer": "<key points a strong answer should cover>",
                    "nextQuestion": "<one natural follow-up question based on their answer>"
                    }
`;


    return await callGroq(prompt, 0.3);
}



async function generateOpeningMessage({ candidateName, jobTitle, resume }) {
    
    const prompt = `
                    You are a friendly but professional interviewer.
                    Candidate name: ${candidateName}
                    Job role: ${jobTitle}
                    Resume summary: ${resume.substring(0, 500)}

                    Generate a warm opening to start the interview.
                    Respond ONLY with JSON:
                    {
                    "message": "<greeting, mention their name and role, 2-3 sentences>",
                    "firstQuestion": "<first interview question based on their resume>"
                    }
`;

    return await callGroq(prompt, 0.5);
}








function safeParse(text) {
    try {
        return JSON.parse(text);
    } catch (err) {
        console.log("❌ JSON Parse Error:", text);
        return null;
    }
}




async function callGroq(prompt, temperature = 0.4) {

    for (const model of MODELS) {
        try {
            console.log(`Trying Groq model: ${model}`);

            const response = await groq.chat.completions.create({
                model,
                messages: [{ role: "user", content: prompt }],
                temperature,
                response_format: { type: "json_object" }
            });

            const content = response.choices[0].message.content;
            const parsed = safeParse(content);

            if (!parsed) throw new Error("Invalid JSON");

            console.log(`✅ Success with model: ${model}`);
            return parsed;

        } catch (error) {
            const status = error.status || error.code;

            const shouldRetry =
                status === 429 ||  // rate limit
                status === 503 ||  // overload
                status === 500;    // server error

            if (shouldRetry) {
                console.log(`⚠️ ${model} failed (${status}), trying next...`);
                continue;
            }

            throw error;
        }
    }

    throw new Error("All Groq models failed");
}



module.exports = { evaluateAnswer, generateOpeningMessage };