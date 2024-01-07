const express = require('express');
const router = express.Router();
const passport = require('../passport');
const reviewController = require('../controllers/api/reviewController');
const authController = require('../controllers/authController');
const authApiController = require('../controllers/api/authController');
const cartController = require('../controllers/api/cardController');
const productController = require('../controllers/api/productController');
const addressController = require('../controllers/api/addressController');
const orderController = require('../controllers/api/orderController');
const userController = require('../controllers/api/userController');
const mailerController = require('../controllers/mailerController');

const initApiRoute = (app) => {
    router.use((req, res, next) => {
        res.locals.flashMessages = req.flash();
        next();
    });
    router.post('/register', authController.checkRegister, mailerController.getMail, (req, res) => {
        res.redirect('/verify-email');
    });

    router.post('/login', passport.authenticate("local",
        {
            failureRedirect: "/",
        }), (req, res) => {
            if (req.user.ADMIN == '1') {
                res.redirect('/static');
            }
            else
                res.redirect('/');
        });
    router.get('/verify', authController.handleRegister);
    router.get('/verify-email', mailerController.getVerifyEmail);

    router.post('/forgot-password', mailerController.getForgetEmail);
    router.get('/reset-password', mailerController.getResetPassword);

    router.get('/logout', authController.isLogged, authController.logout);

    router.get('/api/list-review/:id/', reviewController.getListReview);
    router.get('/api/verify-username/:username', authApiController.verifyUsername);
    router.get('/api/verify-email/:email', authApiController.verifyEmail);
    router.post('/api/add-to-cart/', cartController.addToMyCart);
    router.get('/api/update-product-price-list-order/', productController.updateProductPriceInListOrder);
    router.get('/api/add-to-payment/', productController.updateProductInPayment);
    router.delete('/api/delete-item-in-cart/:id', productController.deleteItemInCart);
    router.post('/api/update-address/', addressController.updateAddress);
    router.post('/api/create-order', orderController.createUserOrder);

    router.get('/api/users-manage/', userController.getListUser);
    router.get('/api/product-manage/', productController.getListProduct);

    return app.use('/', router);
}

module.exports = initApiRoute;