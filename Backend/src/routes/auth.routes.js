const express = require('express');
const { registerUserController, loginUserController, logoutUserController, getMeController } = require('../controller/auth.controller');
const { authUser } = require('../middlewares/auth.middleware');

const authRouter = express.Router();



/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", registerUserController);


/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login", loginUserController);



/**
 * @route GET /api/aith/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
authRouter.get("/logout", logoutUserController);



/**
 * @route GET /api/auth/get-me
 * @description get the cuurent logged in user details, expects token in cookie
 * @access private
 */
authRouter.get("/get-me", authUser, getMeController);

module.exports = authRouter;