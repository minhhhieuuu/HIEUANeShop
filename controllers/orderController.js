const authService = require('../model/authService');
const cartService = require('../model/cartService');
const orderService = require('../model/orderService');
const addressService = require('../model/addressService');

let getListOrderStatusPage = async (req, res) => {
    const idUser = res.locals.user.id;
    const idCart = await cartService.findCartUser(idUser);
    const { AVATAR: ava } = await authService.getUserByID(idUser);
    const numProductInCart = await cartService.numProductInCart(idCart);
    const listOrdered = await orderService.getListAllOrdered(idUser);
    return res.render('status-orders.ejs', { ava, numProductInCart, listOrdered })
}
let getOrderDetailPage = async (req, res) => {
    const idUser = res.locals.user.id;
    const idOrder = req.params.idOrder;
    const idCart = await cartService.findCartUser(idUser);
    const { AVATAR: ava } = await authService.getUserByID(idUser);
    const numProductInCart = await cartService.numProductInCart(idCart);
    const listOrdered = await orderService.getListOrdered(idUser, idOrder);
    const address = await addressService.getUserAddress(idUser);
    return res.render('order-detail.ejs', { ava, numProductInCart, listOrdered, address })
}
let getListFilterOrderStatusPage = async (req, res) => {
    const {status: status} = req.query;
    console.log(status)
    let condition = "";
    if (status === "waiting confirm") condition = "Đang chờ xác nhận";
    else if (status === "waiting take product") condition = "Đang chờ lấy hàng";
    else if (status === "shipping") condition = "Đang giao";
    else if (status === "shipped") condition = "Đã giao";
    else if (status === "canceled") condition = "Đã hủy";
    console.log("condition: ", condition)
    const idUser = res.locals.user.id;

    const idCart = await cartService.findCartUser(idUser);
    const { AVATAR: ava } = await authService.getUserByID(idUser);
    const numProductInCart = await cartService.numProductInCart(idCart);
    const listOrdered = await orderService.getListFilterAllOrdered(idUser, condition);
    const address = await addressService.getUserAddress(idUser);
    return res.render('status-orders.ejs', { ava, numProductInCart, listOrdered, address })
}

module.exports = {
    getListOrderStatusPage,
    getOrderDetailPage,
    getListFilterOrderStatusPage
}