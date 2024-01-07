const express = require('express');
const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');
const router = express.Router();

const adminControllers = require('../controllers/adminControllers');
const authController = require('../controllers/authController');
const passport = require('../passport');
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

const initAdminRoute = (app) => {
    router.get('/static', authController.isLoggedAdmin, adminControllers.getHomePage);
    router.get('/admin-profile/:id', authController.isLoggedAdmin, adminControllers.getAdminProfile);
    router.get('/change-password-admin/:id', authController.isLoggedAdmin, adminControllers.getChangePassword)
    router.post('/admin-profile/:id/update-info', upload.single('update-ava'), adminControllers.updateInformation)
    router.get('/logout', authController.logout);
    router.post('/change-password-admin/:id/update-password', adminControllers.updatePassword);

    return app.use('/', router)
}

module.exports = initAdminRoute;