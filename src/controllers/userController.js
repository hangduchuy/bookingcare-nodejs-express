import userService from "../services/userService";
import db from "../models/index";
const { Sequelize} = require('sequelize');
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errcode: 1,
            message: 'Missing input parameter!'
        })
    }

    let userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id;

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters'
        })
    }

    let users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    console.log(message);
    return res.status(200).json(message);
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let getAllcode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log('Get all code', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// let search = (req,res)=>{
//     let name=req.query.name;
//     let result= userService.search(name);
//     console.log(result);
//     return res.status(200).json({
//         errCode: 0,
//         errMessage: 'OK',
//         result,
//     })
   
// }
let search = async (req, res) => {
    let name = req.query.name;
    let results= {};
    results= await userService.searchSpecialty(name);
    if (results.length === 0) {
        res.json({
          errCode: 1,
          errMessage: `Keyword not found!`
        });
      } else {
        res.json(results);
      }
    
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllcode: getAllcode,
    search:search,
}