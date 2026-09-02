
import express from "express";

import {

    getFavoriteRepositoriesController,
    addFavoriteRepositoryController,
    removeFavoriteRepositoryController

} from "../controllers/favoriteController.js";

import {
    authMiddleware
} from "../middleware/authMiddleware.js";

import {

    addFavoriteRepositoryValidator,
    removeFavoriteRepositoryValidator

} from "../validators/favoriteValidator.js";

import {
    validate
} from "../middleware/validate.js";


const router =
    express.Router();


// =====================================
// Get User Favorite Repositories
// =====================================

router.get(

    "/",

    authMiddleware,

    getFavoriteRepositoriesController

);


// =====================================
// Add Repository to Favorites
// =====================================

router.post(

    "/",

    authMiddleware,

    addFavoriteRepositoryValidator,

    validate,

    addFavoriteRepositoryController

);


// =====================================
// Remove Repository from Favorites
// =====================================

router.delete(

    "/:githubRepositoryId",

    authMiddleware,

    removeFavoriteRepositoryValidator,

    validate,

    removeFavoriteRepositoryController

);


export default router;

