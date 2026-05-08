const { GoogleGenAI } = require("@google/genai");

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
                technical: { type: "number" },
                projects: { type: "number" },
                problemSolving: { type: "number" },
                communication: { type: "number" }
            },
            required: ["technical", "projects", "problemSolving", "communication"]
        },

        averageScore: { type: "number" },
        hiringRecommendation: { type: "string", enum: ["Strong Hire", "Hire", "Consider", "Reject"] },
        confidence: { type: "number", description: "Confidence level from 0 to 100. Example: 85, 90, 95. NEVER return a decimal like 0.95." },
        overallAnalysis: { type: "string" },

        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },

        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"]
            }
        },

        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] },
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
                    day: { type: "number" },
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







// ─────────────────────────────────────────────────────────────
// PASTE THIS ENTIRE FUNCTION into ai.service.js
// Replace your existing generateResumeContent function
// ─────────────────────────────────────────────────────────────

async function generateResumeContent({ resume, jobDescription, selfDescription }) {

    const resumeSchema = {
        type: "object",
        properties: {
            name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            location: { type: "string" },
            linkedin: { type: "string" },
            github: { type: "string" },
            portfolio: { type: "string" },
            leetcode: { type: "string" },
            gfg: { type: "string" },
            roleTitle: { type: "string" },

            summary: {
                type: "string",
                description: "3-4 sentences tailored to the job. Mention job title, top skills, and experience level."
            },

            // Structured skill categories matching CV style
            skillCategories: {
                type: "array",
                description: "Skill categories exactly like: Languages, Backend & APIs, Frontend, Databases, Cloud & DevOps, AI/GenAI, Core CS",
                items: {
                    type: "object",
                    properties: {
                        category: { type: "string" },
                        skills: { type: "string", description: "Comma separated skills for this category" }
                    },
                    required: ["category", "skills"]
                }
            },

            certifications: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        date: { type: "string" },
                        issuer: { type: "string" },
                        link: { type: "string" }
                    },
                    required: ["name"]
                }
            },

            experience: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        role: { type: "string" },
                        company: { type: "string" },
                        duration: { type: "string" },
                        stack: { type: "string" },
                        bullets: {
                            type: "array",
                            items: { type: "string" },
                            description: "3-5 achievement bullets. Start each with action verb. Be specific and measurable."
                        }
                    },
                    required: ["role", "company", "duration", "bullets"]
                }
            },

            projects: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Project name with role e.g. 'Interview AI — GenAI Platform | Full Stack Developer'" },
                        link: { type: "string", description: "GitHub or live URL if present in resume" },
                        date: { type: "string" },
                        stack: { type: "string" },
                        bullets: {
                            type: "array",
                            items: { type: "string" },
                            description: "2-3 impact bullets. Start with action verb. Be specific."
                        }
                    },
                    required: ["name", "stack", "bullets"]
                }
            },

            education: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        degree: { type: "string" },
                        school: { type: "string" },
                        year: { type: "string" },
                        grade: { type: "string" }
                    },
                    required: ["degree", "school", "year"]
                }
            },

            additional: {
                type: "string",
                description: "One line with Languages and Interests. e.g. Languages: English (Professional), Hindi (Native) | Interests: backend, GenAI, competitive programming"
            }
        },
        required: ["name", "email", "summary", "skillCategories", "projects", "education"]
    };

    const prompt = `
You are an expert resume writer and ATS optimization specialist with 10 years of experience.

Rewrite this candidate's resume to be perfectly tailored for the job description below.
Keep all information honest — do not invent anything not in the original resume.

ORIGINAL RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

STRICT RULES:

name: Full name exactly as in resume
roleTitle: Their main role title e.g. "Backend & Full Stack Developer"

summary: 3-4 sentences. Mention the exact job title from JD. Highlight most relevant skills. Include graduation year/SGPA if present.

skillCategories: Extract from resume into these exact categories if applicable:
    - Languages
    - Backend & APIs
    - Frontend
    - Databases
    - Architecture
    - Cloud & DevOps
    - AI / GenAI
    - Core CS
Only include categories that have matching skills in the resume.

certifications: Extract ALL certifications from resume. Include name, date, issuer, and any certificate links.

experience: Rewrite bullets to be specific and measurable. Start every bullet with an action verb.
    GOOD: "Built production REST APIs serving 500+ users with JWT authentication"
    BAD: "Worked on backend APIs"

projects: 
    - Keep project names exactly as in resume
    - Extract GitHub/live links from resume if present
    - Rewrite bullets to highlight impact relevant to the job description
    - Include tech stack exactly

education: Extract all education entries. Include degree, school, year, and grade/CGPA/percentage.

additional: One line combining Languages and Interests from resume.

EXTRACT LINKS from resume text:
    - linkedin: LinkedIn URL
    - github: GitHub URL
    - leetcode: LeetCode URL  
    - gfg: GeeksforGeeks URL
    - portfolio: Portfolio URL
    - phone: phone number
    - location: City, Country/State
If not found in resume, leave as empty string "".
`;

    for (const model of MODELS) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: resumeSchema,
                    temperature: 0.2,
                    maxOutputTokens: 8000
                }
            });

            let result;
            try {
                result = JSON.parse(response.text);
            } catch (parseError) {
                console.log("❌ Full raw response:", response.text);
                throw new Error("AI returned incomplete response. Please try again.");
            }

            console.log(`✅ Resume generated with model: ${model}`);
            return result;

        } catch (error) {
            const shouldTryNext = error.status === 503 || error.status === 429 || error.status === 404;
            if (shouldTryNext) {
                console.log(`⚠️ ${model} failed (${error.status}), trying next...`);
                continue;
            }
            throw error;
        }
    }

    throw new Error("All AI models unavailable. Please try again in a minute.");
}







module.exports = { generateInterviewReport, generateResumeContent };