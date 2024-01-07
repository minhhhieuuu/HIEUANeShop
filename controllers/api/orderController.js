const orderService = require('../../model/orderService');
const productService = require('../../model/productService');
const cartService = require('../../model/cartService');
const addressService = require('../../model/addressService');

const createUserOrder = async (req, res) => {
    const idUser = res.locals.user.id;
    const idAddress = await addressService.getUserAddress(idUser);
    if (!idAddress) res.status(200).json(false);
    const idCart = await cartService.findCartUser(idUser);
    const totalPrice = await cartService.calTotalPriceChosenProducts(idCart);
    await orderService.creatOrder(idUser, idAddress.IDADDRESS, totalPrice);

    const listOrders = await productService.getListChosenOrders(idCart);
    const listIdOrder = await orderService.getLastestIdOrder(idUser);
    const idOrder = listIdOrder[listIdOrder.length - 1];
    const length = listOrders.length;
    for (let i = 0; i < length; i++) {
        await orderService.addToProductOrder(listOrders[i].IDPRODUCT, idOrder.IDORDER, listOrders[i].AMOUNT);
        await productService.updateProductNumbuy(listOrders[i].IDPRODUCT, listOrders[i].AMOUNT);
        await productService.updateProductRemain(listOrders[i].IDPRODUCT, listOrders[i].AMOUNT);
    }
    res.status(200).json(true);
}

module.exports = {
    createUserOrder
}