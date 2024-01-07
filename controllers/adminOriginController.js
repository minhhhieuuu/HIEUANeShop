const adminOriginService = require('../model/adminOriginService')
const authService = require('../model/authService')

let getOriginManage = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    const getManufacturer = await adminOriginService.getAllManufacturer();

    let listOrigin;
    const {
        sortType: sortType,
        sort: sortFilter

    } = req.query;

    if (sortType || sortFilter) {
        listOrigin = await adminOriginService.getSortManufacturer(req.query);
    }
    else listOrigin = getManufacturer;
    const originUrl = `?${req.baseUrl}`;
    return res.render('origin-manage.ejs', { ava, listOrigin: listOrigin, originUrl: originUrl })
}
let getDetailsOrigin = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);
    let idUser = req.params.id;
    const details = await adminOriginService.getManufacturer(idUser);
    return res.render('details-origin.ejs', { ava, details: details })
}
let updateInformation = async (req, res) => {
    const idorigin = req.params.id;
    const { NAMEMANUFACTURER: namemanufacturer } = await adminOriginService.getManufacturer(idorigin);

    const {
        updateNamemanufacturer: new_namemanufacturer,
    } = req.body;



    const result = await adminOriginService.updateorigin(req.body, idorigin)


    if (result) {
        return res.redirect(`/manage/details-origin/${idorigin}`);
    }
    req.flash('updateProfileMsg', 'Kiểm tra lại thông tin cập nhật.');
    return res.redirect(`/manage/details-origin/${idorigin}`);
}
let getAddOrigin = async (req, res) => {
    const { AVATAR: ava } = await authService.getUserByID(res.locals.user.id);

    return res.render('admin-add-origin.ejs', { ava });
}
let deleteInformation = async (req, res) => {
    const idOrigin = req.params.id;

    const result = await adminOriginService.deleteOrigin(idOrigin);

    if (result) {
        return res.redirect(`/origin-manage`);
    }
    req.flash('updateProfileMsg', 'Kiểm tra lại thông tin cập nhật.');
    return res.redirect(`/origin-manage`);
}
let addInformation = async (req, res) => {

    const {
        addNameorigin: addNameorgin,
    } = req.body;


    const result = await adminOriginService.addOrigin(req.body);


    if (result) {
        return res.redirect(`/admin-add-origin`);
    }
    req.flash('updateProfileMsg', 'Kiểm tra lại thông tin cập nhật.');
    return res.redirect(`/admin-add-origin`);
}
module.exports = {
    getOriginManage,
    getDetailsOrigin,
    updateInformation,
    getAddOrigin,
    deleteInformation,
    addInformation

}