const userModel = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');
const { sendPasswordResetEmail, sendOtpEmail } = require('../services/email.service');



/**
 * @name Register User Controller
 * @description register a new user, expects name, email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    // Basic validation...
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Userame, email and password are required" });
    }


    // Check if user already exists...
    const existingUser = await userModel.findOne({
        $or: [ { username}, { email} ]
    });

    if (existingUser) {
        return res.status(400).json({ message: "Account already exists with this username or email" });
    }


    // Hash the password...
    const hash = await bcrypt.hash(password, 10);


    // generate OTP (6 digit)...
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create thr user...
    const user = new userModel({
        username,
        email,
        password: hash,
        otp,
        otpExpires: Date.now() + 5 * 60 * 1000,
        isVerified: false
    });


    await user.save();


    await sendOtpEmail(email, otp);

    console.log(otp);


    return res.status(201).json({
        message: "OTP sent to your email. Please verify your account."
    });



    // const token = jwt.sign(
    //     { id: user._id, username: user.username },
    //     process.env.JWT_SECRET,
    //     { expiresIn: "5d" }
    // )

    // res.cookie("token", token);

    // res.status(201).json({
    //     message: "User registered successfully",
    //     user: {
    //         id: user._id,
    //         username: user.username,
    //         email: user.email
    //     }
    // });
    console.log("Successfull register");

}



/**
 * @name Login User Controller
 * @description login a user, expects email and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    // Basic validation...
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }


    if (!user.isVerified) {
        return res.status(400).json({
            message: "Please verify your email first"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username},
        process.env.JWT_SECRET,
        { expiresIn: "5d" }
    );

    res.cookie("token", token);
    res.status(200).json({
        message: "User login successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
    console.log("Successfull login");
}


/**
 * @name Logout User Controller
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

async function logoutUserController(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(400).json({ message: "No token found in cookies" });
    }


    if (token) {
        await tokenBlacklistModel.create({ token });
    }

    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
    console.log("Successfull logout");
}




/**
 * @name Get Me Controller
 * @description get the cuurent logged in user details.
 * @access private
 */

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User details fetched successfully",
        id: user._id,
        username: user.username,
        email: user.email
    });
}






// forgot-password...
async function forgotPasswordController(req, res) {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(200).json({ message: "If this email exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    await sendPasswordResetEmail(email, token);

    res.status(200).json({ message: "If this email exists, a reset link has been sent." });
}






// reset-password...
async function resetPasswordController(req, res) {
    const { token, newPassword } = req.body;

    const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: "Reset link is invalid or has expired." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: "Password reset successfully. Please log in." });
}






// cahnge-password...
async function changePasswordController(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current and new password are required"
            });
        }

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);

        if (!isValid) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        const isSame = await bcrypt.compare(newPassword, user.password);

        if (isSame) {
            return res.status(400).json({
                message: "New password must be different"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.clearCookie("token");

        return res.status(200).json({
            message: "Password changed successfully. Please login again."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}








// verify otp...
async function verifyOtpController(req, res) {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
        return res.status(400).json({ message: "Already verified" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({
            message: "Invalid or expired OTP"
        });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    return res.status(200).json({
        message: "Email verified successfully"
    });
}









module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    forgotPasswordController,
    resetPasswordController,
    changePasswordController,
    verifyOtpController
}