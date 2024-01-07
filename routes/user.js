const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//Middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/public/images');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Ham để check file
const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(null, false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });

//Khoi tao web router
const initUserRoute = (app) => {
    router.use((req, res, next) => {
        res.locals.flashMessages = req.flash();
        next();
    });
    router.get('/', authController.isLoggedCustomer, userController.getHomepage);
    router.get('/my-profile/:id', authController.isLogged, userController.getProfilePage);
    router.get('/change-password/:id', authController.isLogged, userController.getUpdatePasswordPage);
    router.post('/my-profile/:id/update-info', authController.isLogged, upload.single('update-ava'), userController.updateInformation);
    router.post('/change-password/:id/update-password', authController.isLogged, userController.updatePassword);
    router.post('/reset-password/:id', userController.handleForgotPassword);
    //Web của ta bđau = '/', truyền router vào
    return app.use('/', router);
}

module.exports = initUserRoute;

