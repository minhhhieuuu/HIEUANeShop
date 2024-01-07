const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

//Khoi tao web router
const initProductRoute = (app) => {
    router.use((req, res, next) => {
        res.locals.flashMessages = req.flash();
        next();
    });
    router.get('/products/details/:id', authController.isLoggedCustomer, productController.getDetailProductPage);
    router.get('/list-order', authController.isLogged, productController.getListOrderPage);
    router.get('/payment', authController.isLogged, productController.getPaymentPage);

    return app.use('/', router);
}

module.exports = initProductRoute;

