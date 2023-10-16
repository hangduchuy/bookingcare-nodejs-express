import CRUDservice from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        return res.render('homepage.ejs', {
            data: JSON.stringify({})
        });
    } catch (e) {
        console.log(e)
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDservice.createNewUser(req.body);
    return res.send('crud');
}

let dislayGetCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDservice.getUserInfoById(userId);
        return res.render('editCRUD.ejs', {
            user: userData
        });
    }
    else {
        return res.send('User not found')
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDservice.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUser
    });
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDservice.deleteUserById(id);
        return res.send('Delete succeed')
    } else {
        return res.send('use not found')
    }
}

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    dislayGetCRUD: dislayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}