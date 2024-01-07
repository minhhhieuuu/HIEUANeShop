const nodemailer = require('nodemailer');
const authService = require('../model/authService');

let getMail = async (req, res, next) => {
    const { username, email: mail, password: pw, confirmPassword } = req.body;
    //console.log(req.body)
    const link = `<a href="http://localhost:3000/verify?username=${username}&email=${mail}&pw=${pw}"> Nhấn vào đây để xác minh tài khoản</a>`
    const msg = {
        from: "H0902716511@gmail.com",
        to: mail,
        subject: "Test sendmail",
        html: link
    };
    //console.log(msg);
    nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "H0902716511@gmail.com",
            pass: "pjpixpsmccdprnjn",
        },
        port: 465,
        secure: true,
        host: 'smtp.gmail.com'
    })

        .sendMail(msg, (err) => {
            if (err) {
                req.flash('forgetMessage', 'Lỗi')
                return console.log('Error occurs', err);
            } else {
                return req.flash('forgetMessage', 'Thành công')
            
            }
        })
    next();
}

let getVerifyEmail = async (req, res) => {

    return res.render('verify-email.ejs');
}

let getForgetEmail = async (req, res) => {
    const {
        email: mail
    } = req.body
    const idUser = await authService.getIDUserByEmail(mail);
    if (!idUser) {
        req.flash('emailMessage', 'Email không tồn tại');
        return res.redirect('/');
    }
    const msg = {
        from: "H0902716511@gmail.com",
        to: mail,
        subject: "Verification",
        html: `<a href="http://localhost:3000/reset-password?iduser=${idUser.IDUSER}">cccc</a>`
    };

    nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "H0902716511@gmail.com",
            pass: "pjpixpsmccdprnjn",
        },
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
    })

        .sendMail(msg, (err) => {
            if (err) {
                req.flash('forgetMessage', 'Lỗi')
                return console.log('Error occurs', err);
            } else {


                return res.render('confirm.ejs');
            }
        })
}

let getResetPassword = async (req, res) => {
    const {iduser: idUser} = req.query;
    console.log(idUser);
    return res.render('reset-password.ejs', {idUser});
}


module.exports = {
    getMail,
    getVerifyEmail,
    getForgetEmail,
    getResetPassword
}