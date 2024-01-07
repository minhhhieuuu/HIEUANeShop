const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

//Khoi tao web router
const initReviewRoute = (app) => {
    router.post('/products/details/:id/post-review', authController.isLogged, reviewController.postReview);
    //Web của ta bđau = '/', truyền router vào
    return app.use('/', router);
}

module.exports = initReviewRoute;

