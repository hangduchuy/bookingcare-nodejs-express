import userService from '../services/userService'
import db from '../models/index'
import moment from 'moment'
const { Sequelize } = require('sequelize')
let handleLogin = async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        return res.status(500).json({
            errcode: 1,
            message: 'Missing input parameter!'
        })
    }

    let userData = await userService.handleUserLogin(email, password)

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters'
        })
    }

    let users = await userService.getAllUsers(id)

    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)
    return res.status(200).json(message)
}

let handleEditUser = async (req, res) => {
    let data = req.body
    let message = await userService.updateUserData(data)
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message)
}

let getAllcode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type)
        return res.status(200).json(data)
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
    let name = req.query.name
    let results = {}
    results = await userService.searchSpecialty(name)
    if (results.length === 0) {
        res.json({
            errCode: 1,
            errMessage: `Keyword not found!`
        })
    } else {
        res.json(results)
    }
}

let totalMoney = async (req, res) => {
    let results = await userService.getTotalMoney()
    if (results.length === 0) {
        res.json({
            errCode: 1,
            errMessage: 'Data can`t load'
        })
    } else {
        res.json(results)
    }
}

let dataForBarChart = async (req, res) => {
    try {
        let results = await userService.totalMoneyOnMonthPerYear()
        if (results.length === 0) {
            res.json({
                errCode: 1,
                errMessage: "Data can't load"
            })
            return // Exit the function early if there's no data
        }

        // Initialize a Map to store data for each year
        let dataByYear = new Map()

        // Iterate through the results and categorize data by year
        for (let i = 0; i < results.length; i++) {
            let inArray = results[i].date
            let dateString = moment(parseInt(inArray)).format('L')
            const parts = dateString.split('/')
            if (parts.length === 3) {
                const yyyy = parts[2]
                const dd = parts[1]
                const mm = parts[0]
                const formattedDate = `${yyyy}/${mm}/${dd}`
                let date = new Date(formattedDate)
                let year = date.getFullYear()

                if (!dataByYear.has(year)) {
                    dataByYear.set(year, Array(12).fill(0))
                }

                let month = date.getMonth()
                dataByYear.get(year)[month]++
            }
        }

        // Convert Map to JSON format
        let dataChart = {}
        for (let [year, values] of dataByYear) {
            dataChart[year] = values
        }

        res.json(dataChart)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            errCode: 500,
            errMessage: 'Internal server error'
        })
    }
}
let getAllCustomer = async (req, res) => {
    try {
        const results = await userService.getTotalCustomer()
        const count = results.length

        res.json({ count: count })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while counting customers.' })
    }
}

let getMostSpecialized = async (req, res) => {
    try {
        let data = await userService.getMostSpecialized()
        return res.status(200).json(data)
    } catch (e) {
        console.log('getMostSpecialized', e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllcode: getAllcode,
    search: search,
    totalMoney: totalMoney,
    dataForBarChart: dataForBarChart,
    getAllCustomer: getAllCustomer,
    getMostSpecialized: getMostSpecialized
}
