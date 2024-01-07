const productService = require('../model/productService');
const userService = require('../model/userService');
const reviewService = require('../model/reviewService');
const authService = require('../model/authService');
const cartService = require('../model/cartService');
const Paginator = require("paginator");
const qs = require('qs');


const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

let getHomepage = async (req, res) => {
    const paginator = new Paginator(10, 5);
    let ava = null, numProductInCart = null;
    if (res.locals.user) {
        const { AVATAR } = await authService.getUserByID(res.locals.user.id);
        if (AVATAR) ava = AVATAR;
        const idCart = await cartService.findCartUser(res.locals.user.id);
        numProductInCart = await cartService.numProductInCart(idCart);
    }
    let products, allProducts, pagination_info, length;
    const {
        name: nameFilter,
        type: typeFilter,
        brand: brandFilter,
        manufacturer: manufacturerFilter,
        priceFrom: priceFrom,
        priceTo: priceTo,
        numBuy: numBuy,
        sortPrice: sortPrice,
        timeCreate: timeCreate,
        sort: sortFilter,

    } = req.query;
    const {
        page, ...withoutPage
    } = req.query;

    let currentPage = req.query.page ? +req.query.page : 1;
    let random_names = [];
    allProducts = await productService.getAllProduct();
    length = allProducts.length;
    for (let i = 0; i < 6; i++) {
        let num = Math.floor(Math.random() * length);
        let check = true;
        for (let j = 0; j < random_names.length; j++) {
            if (random_names[j] && random_names[j] === allProducts[num].NAMEPRODUCT) {
                check = false
            }

        }
        if (check || random_names.length < 1) {
            random_names.push(allProducts[num].NAMEPRODUCT)
        }
        else i--
    }
    if (nameFilter || typeFilter || manufacturerFilter || brandFilter || priceFrom || priceTo || numBuy || sortPrice || timeCreate || sortFilter) {
        allProducts = await productService.getFilterProducts(req.query);
        length = allProducts.length;
        pagination_info = paginator.build(length, currentPage);
        if (currentPage < 1) currentPage = 1;
        else if (currentPage > pagination_info.total_pages) currentPage = pagination_info.total_pages;
        let { limit, offset } = getPagination(currentPage - 1, req.query.size);
        if (offset < 0) offset = 0;
        products = await productService.getFilterProductsPage(req.query, limit, offset);
    }

    else {
        pagination_info = paginator.build(length, currentPage);
        if (currentPage < 1) currentPage = 1;
        else if (currentPage > pagination_info.total_pages) currentPage = pagination_info.total_pages;
        let { limit, offset } = getPagination(currentPage - 1, req.query.size);
        if (offset < 0) offset = 0;
        products = await productService.getProductsPage(limit, offset);
    }

    const brands = await productService.getAllBrand();
    const manufacturers = await productService.getAllManufacturer();
    const types = await productService.getAllType();

    let iterator = (currentPage - 5) < 1 ? 1 : currentPage - 4;
    let endingLink = (iterator + 4) <= pagination_info.total_pages ? (iterator + 4) : currentPage + (pagination_info.total_pages - currentPage);

    const originUrl = `${req.baseUrl}?${qs.stringify(withoutPage)}`;

    return res.render('home.ejs', {
        numProductInCart,
        ava,
        originUrl,
        products, brands, types, manufacturers, names: random_names, pagination_info, iterator, endingLink
    });
}

let getProfilePage = async (req, res) => {
    const idCart = await cartService.findCartUser(res.locals.user.id);
    const { EMAIL: email, FULLNAME: fullname, SEX: sex, PHONE: phone, AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    const numProductInCart = await cartService.numProductInCart(idCart);
    return res.render('my-profile.ejs', { email, fullname, sex, phone, ava, numProductInCart });
}
let updateInformation = async (req, res) => {
    const idUser = req.params.id;
    const { EMAIL: email, FULLNAME: fullname, SEX: sex, PHONE: phone, AVATAR: ava } = await authService.getUserByID(idUser);
    let new_ava = ava;
    if (req.file) {
        new_ava = '/images/' + req.file.filename;
    }
    const {
        updateFullname: new_fullname,
        updateEmail: new_email,
        updatePhone: new_phone,
        updateSex: new_sex
    } = req.body;



    if (new_phone.length > 11) {
        req.flash('updateProfileMsg', 'SĐT phải nhỏ hơn 12 kí tự.');
        return res.redirect(`/my-profile/${idUser}`);
    }

    const result = await userService.updateProfile(req.body, new_ava, idUser);

    if (result) {
        return res.redirect(`/my-profile/${idUser}`);
    }
    req.flash('updateProfileMsg', 'Kiểm tra lại thông tin cập nhật.');
    return res.redirect(`/my-profile/${idUser}`);
}
let getUpdatePasswordPage = async (req, res) => {
    const idCart = await cartService.findCartUser(res.locals.user.id);
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    const numProductInCart = await cartService.numProductInCart(idCart);
    return res.render('change-password.ejs', { ava, numProductInCart })

}
let updatePassword = async (req, res) => {
    const {
        curPass,
        newPass,
        confPass
    } = req.body;
    const idUser = req.params.id;
    if (!curPass || !newPass || !confPass) {
        req.flash('updatePassMsg', 'Vui lòng nhập đủ thông tin.');
        return res.redirect(`/change-password/${idUser}`);
    }
    if (curPass.length < 6 || newPass.length < 6 || confPass.length < 6) {
        req.flash('updatePassMsg', 'Mật khẩu phải ít nhất 6 ký tự.');
        return res.redirect(`/change-password/${idUser}`);
    }
    if (newPass !== confPass) {
        req.flash('updatePassMsg', 'Xác nhận mật khẩu không trùng.');
        return res.redirect(`/change-password/${idUser}`);
    }
    if (!await authService.checkUserCredential(res.locals.user.username, curPass)) {

        req.flash('updatePassMsg', 'Nhập sai mật khẩu hiện tại.');
        return res.redirect(`/change-password/${idUser}`);
    }
    const result = await userService.updatePassword(req.body, idUser);
    if (result) {
        req.flash('updatePassMsg', 'Đổi mật khẩu thành công.');
        return res.redirect(`/change-password/${idUser}`);
    }
    req.flash('updatePassMsg', 'Đổi mật khẩu thất bại.');
    return res.redirect(`/change-password/${idUser}`);
}
let handleForgotPassword = async (req, res) => {
    const { newPass, confPass } = req.body;
    console.log(req.body)
    if (!newPass || !confPass) {
        req.flash('resetPassMsg', 'Vui lòng nhập đủ thông tin.');
        return res.redirect(`/reset-password?iduser=${req.params.id}`);
    }
    if (newPass.length < 6 || confPass.length < 6) {
        req.flash('resetPassMsg', 'Mật khẩu phải ít nhất 6 ký tự.');
        return res.redirect(`/reset-password?iduser=${req.params.id}`);
    }
    if (newPass !== confPass) {
        req.flash('resetPassMsg', 'Xác nhận mật khẩu không trùng.');
        return res.redirect(`/reset-password?iduser=${req.params.id}`);
    }
    const result = await userService.updatePassword(req.body, req.params.id);
    if (result) {
        const result = await authService.getUserByID(req.params.id);
        req.login(result, function (err) {
            console.log(result)
            if (result.ADMIN === '1')
                res.redirect('/static');
            else
                res.redirect('/');
        });
    }
}
module.exports = {
    getHomepage,
    getProfilePage,
    getUpdatePasswordPage,
    updateInformation,
    updatePassword,
    handleForgotPassword
}