const mongoose = require('mongoose');

const usageLimitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    type: {
        type: String,
        enum: ["report", "resume", "mock"],
        required: true
    },

    count: {
        type: Number,
        default: 0
    },

    resetAt: {
        type: Date,
        default: function() {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth() + 1, 1);
        }
    }

}, { timestamps: true });


usageLimitSchema.index({ user: 1, type: 1 }, { unique: true });


module.exports = mongoose.model("usageLimit", usageLimitSchema);