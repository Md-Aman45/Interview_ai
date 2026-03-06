const userModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

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

    // Create thr user...
    const user = new userModel({
        username,
        email,
        password: hash
    });


    await user.save();



    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "5d" }
    )

    res.cookie("token", token);

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
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


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}