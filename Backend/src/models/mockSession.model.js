const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },

    userAnswer: {
        type: String,
        default: ""
    },

    score: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },

    feedback: {
        type: String,
        default: ""
    },

    idealAnswer: {
        type: String,
        default: ""
    },

    nextQuestion: {
        type: String,
        default: ""
    },

}, { 
    _id: false 
});




const mockSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "interviewReport",
        required: true
    },

    jobTitle: {
        type: String,
        required: true
    },
    
    answers: [answerSchema],

    totalQuestions: {
        type: Number,
        default: 0
    },

    averageScore: {
        type: Number,
        default: 0
    },

    startedAt: {
        type: Date,
        default: Date.now
    },

    sessionDuration: {
        type: Number,
        default: 30
    },

    status: {
        type: String,
        enum: [ "ongoing", "completed" ],
        default: "ongoing"
    }
}, {
    timestamps: true
});



module.exports = mongoose.model("mockSession", mockSessionSchema);