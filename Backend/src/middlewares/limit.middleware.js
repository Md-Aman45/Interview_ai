const usageLimitModel = require('../models/usageLimit.model');

const LIMITS = {
    report: 20,
    resume: 15,
    mock: 10
};



function checkLimit(type) {
    return async function (req, res, next) {
        try {
            const now = new Date();

            let usage = await usageLimitModel.findOne({
                user: req.user.id,
                type
            });

            if (!usage) {
                usage = await usageLimitModel.create({
                    user: req.user.id,
                    type,
                    count: 0
                });
            }

            if (now >= usage.resetAt) {
                usage.count = 0;
                usage.resetAt = new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    1
                );

                await usage.save();
            }

            if (usage.count >= LIMITS[type]) {
                const resetDate = new Date(usage.resetAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                });

                return res.status(429).json({
                    success: false,
                    message: `You've used 100% of your ${type} limit for this month. Your limit resets on ${resetDate}. Please wait until then to generate more.`,
                    limit: LIMITS[type],
                    used: usage.count,
                    resetsOn: resetDate,
                });
            }

            usage.count += 1;
            await usage.save();


            req.usageInfo = {
                type,
                used: usage.count,
                limit: LIMITS[type],
                resetsOn: usage.resetAt.toDateString()
            };

            next();

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
}


module.exports = { checkLimit };