const cartService = require('../../model/cartService');


let addToMyCart = async (req, res) => {
    const { idProduct, amount } = req.body;
    const idCart = await cartService.findCartUser(res.locals.user.id);
    await cartService.addProductCart(idCart, idProduct, amount);
    const totalPrice = await cartService.calTotalPriceInCart(idCart);
    if (totalPrice)
        await cartService.updateTotalPriceCart(idCart, totalPrice);
    const numProductInCart = await cartService.numProductInCart(idCart);
    return res.status(200).json(numProductInCart);
}

module.exports = {
    addToMyCart
}