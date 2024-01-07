const addressService = require('../../model/addressService');
const updateAddress = async (req, res) => {
    const { name, phone, address } = req.body;
    //console.log(name, phone, address)
    const idUser = res.locals.user.id;
    await addressService.updateAddress(idUser, name, address, phone);

    res.status(200).json(true);
}

module.exports = {
    updateAddress
}