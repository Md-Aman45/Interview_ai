const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const { be } = require("zod/v4/locales");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


// async function invokeGeminiAI(prompt){
//     try {
//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: prompt
//         });

//         console.log(response.text);
//         return response.text;
//     }
//     catch (error) {
//         console.log("Gemini Error:", error.message);

//         // handle overload
//         if (error.status === 503) {
//             return "AI is busy, please try again later.";
//         }

//         // handle overload
//         if (error.status === 429) {
//             return "Daily limit reached. Try tomorrow.";
//         }

//         throw error;
//     }
// }


// const interviewReportSchema = z.object({

//     matchScore: z.number().describe("The match score between the candidate's profile and the job description, on a scale of 0 to 100."),


//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview."),
//         intention: z.string().describe("The intention of interviewer behind asking this question."),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
//     })).describe("List of technical questions that can be asked in the interview, along with the intention behind asking those questions and how to answer them."),




//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The behavioral question can be asked in the interview."),
//         intention: z.string().describe("The intention of interviewer behind asking this question."),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
//     })).describe("List of behavioral questions that can be asked in the interview, along with the intention behind asking those questions and how to answer them."),





//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill that the candidate is lacking based on the resume, self-description and job description."),
//         severity: z.enum(["Low", "Medium", "High"]).describe("The severity of the skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances"),
//     })).describe("List of skill gaps that the candidate has based on the resume, self-description and job description, along with the severity of each skill gap."),




//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1."),
//         focus: z.string().describe("The main focus of the preparation for that day, e.g. data structures, system design, mock interviews etc."),
//         tasks: z.array(z.string()).describe("List of tasks to be completed on that day, e.g. solve 5 problems on LeetCode, read a chapter of a book, watch a video tutorial etc."),
//     })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively."),


//     title: z.string().describe("The title of the interview report, e.g. 'Interview Preparation Report for Software Engineer Role at Google'"),

// })



const interviewReportSchema = z.object({

    matchScore: z.number().describe(
        "Match score (0–100) representing how well the candidate fits the job based on skills, projects, and experience."
    ),

    scoreBreakdown: z.object({
        technical: z.number().describe(
            "Score (0–10) for technical skills such as Node.js, databases, APIs, and system knowledge."
        ),
        projects: z.number().describe(
            "Score (0–10) based on real-world project experience, complexity, and implementation quality."
        ),
        problemSolving: z.number().describe(
            "Score (0–10) based on DSA knowledge, logical thinking, and coding ability."
        ),
        communication: z.number().describe(
            "Score (0–10) based on clarity, explanation skills, and confidence."
        )
    }),

    averageScore: z.number().describe(
        "Average score (0–10) calculated from all score breakdown categories."
    ),

    hiringRecommendation: z.enum(["Strong Hire", "Hire", "Consider", "Reject"]).describe(
        "Final hiring decision based on overall evaluation and scoring."
    ),

    confidence: z.number().describe(
        "Confidence level (0–100) indicating how confident the AI is about this evaluation."
    ),

    overallAnalysis: z.string().describe(
        "Detailed evaluation of the candidate including strengths, weaknesses, and overall performance."
    ),

    technicalQuestions: z.array(
        z.object({
            question: z.string().describe(
                "A realistic and role-specific technical interview question."
            ),
            intention: z.string().describe(
                "What the interviewer is trying to evaluate with this question."
            ),
            answer: z.string().describe(
                "A structured and ideal answer approach including key points and explanation."
            ),
            score: z.number().optional().describe(
                "Optional score (0–10) if candidate answers this question."
            ),
            feedback: z.string().optional().describe(
                "Optional feedback explaining strengths and improvement areas."
            )
        })
    ).describe("List of technical interview questions with intention and ideal answers."),

    behavioralQuestions: z.array(
        z.object({
            question: z.string().describe(
                "A realistic behavioral interview question (HR/soft skills)."
            ),
            intention: z.string().describe(
                "What personality trait or behavior is being evaluated."
            ),
            answer: z.string().describe(
                "A structured answer using frameworks like STAR method."
            ),
            score: z.number().optional().describe(
                "Optional score (0–10) for candidate response."
            ),
            feedback: z.string().optional().describe(
                "Optional feedback on communication and behavior."
            )
        })
    ).describe("List of behavioral questions with evaluation intent and answers."),

    skillGaps: z.array(
        z.object({
            skill: z.string().describe(
                "A missing or weak skill relevant to the job role."
            ),
            severity: z.enum(["low", "medium", "high"]).describe(
                "Impact level of this skill gap on hiring decision."
            ),
            recommendation: z.string().describe(
                "Specific and actionable suggestion to improve this skill."
            )
        })
    ).describe("List of missing skills and how to improve them."),

    preparationPlan: z.array(
        z.object({
            day: z.number().describe(
                "Day number in preparation plan starting from 1."
            ),
            focus: z.string().describe(
                "Main focus area for that day (e.g., DSA, backend, system design)."
            ),
            tasks: z.array(z.string()).describe(
                "Concrete actionable tasks (e.g., solve 5 problems, build API, revise concepts)."
            )
        })
    ).describe("Day-wise preparation roadmap for interview success."),

    title: z.string().describe(
        "Title of the report, e.g., 'Interview Preparation Report for Software Engineer Role'."
    )

});


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    // const prompt = `Generate an interview report for a candidate with the following details:
    //                     Resume: ${resume}
    //                     Self Description: ${selfDescription}
    //                     Job Description: ${jobDescription}
    // `


    const prompt = `
You are a senior AI interviewer.

Generate a STRICT JSON response ONLY.

DO NOT add extra fields.
DO NOT change field names.

Follow EXACT structure:

{
  "matchScore": number (0-100),
  "scoreBreakdown": {
    "technical": number (0-10),
    "projects": number (0-10),
    "problemSolving": number (0-10),
    "communication": number (0-10)
  },
  "averageScore": number (0-10),
  "hiringRecommendation": "Strong Hire" | "Hire" | "Consider" | "Reject",
  "confidence": number (0-100),
  "overallAnalysis": string,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high",
      "recommendation": string
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": [string]
    }
  ],
  "title": string
}

Candidate Data:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;


    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            // model: "gemini-2.5-flash-lite",
            // model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: zodToJsonSchema(interviewReportSchema),
                temperature: 0.2
            }
        })
        console.log(JSON.parse(response.text));
    } catch (error) {

        console.log("Gemini Error:", error.message);

        if (error.status === 429) {
            throw new Error("Daily limit reached");
        }

        if (error.status === 503) {
            throw new Error("AI busy, try again later");
        }

        throw error;
    }

}



module.exports = generateInterviewReport;