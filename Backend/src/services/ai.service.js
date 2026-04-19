const { GoogleGenAI } = require("@google/genai");
// const { z } = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});





const interviewReportSchema = {
    type: "object",
    properties: {

        matchScore: { 
            type: "number",
            description: "Match score from 0 to 100. Example: 85, 90, 72. NEVER return a decimal like 0.9 or a single digit like 9."
        },

        scoreBreakdown: {
            type: "object",
            properties: {
                technical:      { type: "number" },
                projects:       { type: "number" },
                problemSolving: { type: "number" },
                communication:  { type: "number" }
            },
            required: ["technical", "projects", "problemSolving", "communication"]
        },

        averageScore:          { type: "number" },
        hiringRecommendation:  { type: "string", enum: ["Strong Hire", "Hire", "Consider", "Reject"] },
        confidence:            { type: "number", description: "Confidence level from 0 to 100. Example: 85, 90, 95. NEVER return a decimal like 0.95." },
        overallAnalysis:       { type: "string" },

        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question:  { type: "string" },
                    intention: { type: "string" },
                    answer:    { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },

        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question:  { type: "string" },
                    intention: { type: "string" },
                    answer:    { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },

        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill:          { type: "string" },
                    severity:       { type: "string", enum: ["low", "medium", "high"] },
                    recommendation: { type: "string" }
                },
                required: ["skill", "severity", "recommendation"]
            }
        },

        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day:   { type: "number" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } }
                },
                required: ["day", "focus", "tasks"]
            }
        },

        title: { type: "string" }
    },
    required: [
        "matchScore", "scoreBreakdown", "averageScore",
        "hiringRecommendation", "confidence", "overallAnalysis",
        "technicalQuestions", "behavioralQuestions",
        "skillGaps", "preparationPlan", "title"
    ]
};





// Only real, stable, free tier models — in order of preference
const MODELS = [
    "gemini-2.5-flash",   // best quality, use first
    "gemini-3-flash-preview",   // newer, may be unstable, use second
    "gemini-2.5-flash-lite",   // faster but lower quality, use third
];





async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
                    You are an expert technical interviewer and career coach with 10 years of experience hiring software engineers.

                    Analyze this candidate carefully and generate a complete interview preparation report.

                    ---

                    CANDIDATE RESUME:
                    ${resume}

                    ---

                    CANDIDATE SELF-DESCRIPTION:
                    ${selfDescription}

                    ---

                    JOB DESCRIPTION:
                    ${jobDescription}

                    ---

                    STRICT RULES:

                    scoreBreakdown must have EXACTLY these 4 keys with number values:
                    - technical: 0-10 for programming and tech skills
                    - projects: 0-10 for project quality and complexity
                    - problemSolving: 0-10 for DSA and logical thinking
                    - communication: 0-10 for clarity in self-description

                    technicalQuestions: EXACTLY 5 objects, each with question, intention, answer
                    behavioralQuestions: EXACTLY 3 objects, each with question, intention, answer
                    skillGaps: EXACTLY 4 objects. skill must be max 4 words. severity must be low/medium/high
                    preparationPlan: EXACTLY 5 objects. Each must have day number, focus title, and tasks array

                    QUALITY RULES:
                    - Questions must be specific to this candidate's actual resume and projects
                    - Tasks must be concrete and actionable, not vague
                    - Never return null or empty strings for any field
                    - scoreBreakdown must always be an object with 4 number values, never an array
`;







    for (const model of MODELS) {
        try {
            console.log(`Trying model: ${model}...`);

            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    // responseJsonSchema: zodToJsonSchema(interviewReportSchema),
                    responseSchema: interviewReportSchema,
                    temperature: 0.2,
                    maxOutputTokens: 8000
                }
            });

            const result = JSON.parse(response.text);
            console.log(`✅ Report generated with model: ${model}`);
            console.log(JSON.stringify(result, null, 2));
            return result;

        } catch (error) {
            const shouldTryNext =
                error.status === 503 ||
                error.status === 429 ||
                error.status === 404;

            if (shouldTryNext) {
                console.log(`⚠️ ${model} failed (${error.status}), trying next...`);
                continue;
            }

            throw error;
        }
    }

    throw new Error("All AI models unavailable. Please try again in a minute.");
}




module.exports = generateInterviewReport;