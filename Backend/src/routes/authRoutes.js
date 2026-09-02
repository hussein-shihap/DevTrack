import express from "express";

import {
    login,
    register
} from "../controllers/authController.js";

import {
    googleLogin,
    googleCallback
} from "../controllers/googleAuthController.js";

import {
    validate
} from "../middleware/validate.js";

import {
    loginValidator,
    registerValidator
} from "../validators/authValidator.js";

import {
    loginLimiter
} from "../middleware/rateLimiter.js";


const router = express.Router();


// =====================================
// Normal Authentication
// =====================================

router.post(
    "/login",
    loginLimiter,
    loginValidator,
    validate,
    login
);


router.post(
    "/register",
    registerValidator,
    validate,
    register
);





// =====================================
// Google Authentication
// =====================================

router.get(
    "/google",
    googleLogin
);


router.get(
    "/google/callback",
    googleCallback
);


export default router;