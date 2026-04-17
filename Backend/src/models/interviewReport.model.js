const mongoose = require('mongoose');
const { de } = require('zod/v4/locales');


/**
 * - job description schema : type: String
 * 
 * - resume text : type: String
 * 
 * - Self description : type: String
 * 
 * - matchScore : Number
 * 
 * - Technical questions : 
 *              [{
 *                 question : "",
 *                 intention : "",
 *                 answer : "",
 *              }]
 * 
 * - Behavioral questions : 
 *              [{
 *                 question : "",
 *                 intention : "",
 *                 answer : "",
 *              }]
 * 
 * - Skill gaps : 
 *              [{
 *                 skill : "",
 *                 severity : {
 *                    type : String,
 *                    enum : ["low", "medium", "high"]
 *                 },
 *              }]
 * 
 * - preparation plan : 
 *              [{
 *                day : Number,
 *                focus : String,
 *                tasks : [String]
 *              }]
 * 
 */





const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },

    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    },

    score: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },

    feedback: {
        type: String,
        default: "",
    },
}, {
    _id: false  
})




const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [ true, "Behavioral question is required" ]
    },

    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    },

    score: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },

    feedback: {
        type: String,
        default: "",
    },
}, {
    _id: false
})




const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [ true, "Skill is required" ]
    },

    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required" ]
    },

    recommendation: {
        type: String,
        default: "",
    },
}, {
    _id: false
})




const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, "Day is required" ]
    },
    
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },

    tasks: [{
        type: String,
        required: [ true, "Task is required" ]
    }]
})






const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [ true, "Job description is required" ]
    },

    resume: {
        type: String,
    },

    selfDescription: {
        type: String,
    },

    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },


    scoreBreakdown: {
        technical: { type: Number, min: 0, max: 10 },
        projects: { type: Number, min: 0, max: 10 },
        problemSolving: { type: Number, min: 0, max: 10 },
        communication: { type: Number, min: 0, max: 10 }
    },

    averageScore: {
        type: Number,
        min: 0,
        max: 10
    },

    hiringRecommendation: {
        type: String,
        enum: ["Strong Hire", "Hire", "Consider", "Reject"],
    },

    confidence: {
        type: Number,
        min: 0,
        max: 100
    },


    overallAnalysis: {
        type: String
    },


    technicalQuestions: [ technicalQuestionSchema ],

    behavioralQuestions: [ behavioralQuestionSchema ],

    skillGaps: [ skillGapSchema ],

    preparationPlan: [ preparationPlanSchema ],


    round: {
        type: String,
        enum: ["resume", "technical", "behavioral"],
        default: "resume"
    },

    status: {
        type: String,
        enum: ["draft", "completed"],
        default: "completed"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },

    title: {
        type: String,
        required: [ true, "Job title is required" ]
    }

}, {
    timestamps: true
})



const interviewReportModel = mongoose.model("interviewReport", interviewReportSchema);


module.exports = interviewReportModel;