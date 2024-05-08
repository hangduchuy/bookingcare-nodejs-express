import connectDB from '../config/connectDB'
import db from '../models/index'
import bcrypt from 'bcryptjs'
import moment from 'moment'
const { Sequelize } = require('sequelize')

var salt = bcrypt.genSaltSync(10)

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hasPassword = await bcrypt.hashSync(password, salt)
            resolve(hasPassword)
        } catch (e) {
            reject(e)
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                })
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password)
                    if (check) {
                        userData.errCode = 0
                        userData.errMessage = `OK`

                        delete user.password
                        userData.user = user
                    } else {
                        userData.errCode = 3
                        userData.errMessage = `Wrong password`
                    }
                } else {
                    userData.errCode = 2
                    userData.errMessage = `User's not found`
                }
            } else {
                userData.errCode = 1
                userData.errMessage = `Your's Email isn't exist in your system. Plz try other email!`
            }

            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }

            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist ???
            if (Array.isArray(data)) {
                // If data is an array of objects
                const promises = data.map(async (item) => {
                    let check = await checkUserEmail(item.email)
                    if (check === true) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Your email is already in used, Plz try another email!!'
                        })
                    } else {
                        // let hasPasswordFromBcrypt = await hashUserPassword(item.password)
                        const newUser = await db.User.create({
                            email: item.email,
                            // password: hasPasswordFromBcrypt,
                            firstName: item.firstName,
                            lastName: item.lastName,
                            address: item.address
                            // phonenumber: item.phonenumber,
                            // gender: item.gender,
                            // roleId: item.roleId,
                            // positionId: item.positionId,
                            // image: item.avatar
                        })
                        console.log('newUser', newUser)
                        resolve({
                            errCode: 0,
                            errMessage: 'OK'
                        })
                    }
                })
            } else {
                // If data is a single object
                let check = await checkUserEmail(data.email)
                if (check === true) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Your email is already in used, Plz try another email!!'
                    })
                } else {
                    let hasPasswordFromBcrypt = await hashUserPassword(data.password)

                    await db.User.create({
                        email: data.email,
                        password: hasPasswordFromBcrypt,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        phonenumber: data.phonenumber,
                        gender: data.gender,
                        roleId: data.roleId,
                        positionId: data.positionId,
                        image: data.avatar
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }

        await db.User.destroy({
            where: { id: userId }
        })

        resolve({
            errCode: 0,
            errMessage: `The user is deleted`
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing required parameters`
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address
                user.roleId = data.roleId
                user.positionId = data.positionId
                user.gender = data.gender
                user.phonenumber = data.phonenumber
                if (data.avatar) {
                    user.image = data.avatar
                }

                await user.save()
                resolve({
                    errCode: 0,
                    errMessage: 'Update the user suceeds!'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let res = {}
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                })
                res.errCode = 0
                res.data = allcode
                resolve(res)
            }
        } catch (e) {
            reject(e)
        }
    })
}
let searchSpecialty = (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let results = await db.Specialty.findAll({
                where: {
                    name: {
                        [Sequelize.Op.like]: `%${name}%`
                    }
                }
            })
            resolve(results)
        } catch (e) {
            reject(e)
        }
    })
}

let getTotalMoney = async () => {
    try {
        let bookingResults = await db.Booking.findAll();
        if (bookingResults.length > 0) {
            let moneyByYear = new Map(); // Khởi tạo Map để lưu trữ dữ liệu theo từng năm
            for (let i = 0; i < bookingResults.length; i++) {
                const booking = bookingResults[i];
                if (booking.priceId !== undefined) {
                    let inArray = booking.date;
                    let dateString = moment(parseInt(inArray)).format('L');
                    const parts = dateString.split('/');
                    if (parts.length === 3) {
                        const yyyy = parts[2];
                        const dd = parts[1];
                        const mm = parts[0];
                        const formattedDate = `${yyyy}/${mm}/${dd}`;
                        let date = new Date(formattedDate);
                        let year = date.getFullYear();
                        if (!moneyByYear.has(year)) {
                            moneyByYear.set(year, 0);
                        }
                        let results = await db.Allcode.findAll({
                            where: { key: booking.priceId },
                            attributes: ['valueVi'] // Chỉ lấy trường 'valueVi'
                        });
                        // Tính tổng các giá trị 'valueVi' và cộng vào moneyByYear cho từng năm
                        let sum = results.reduce((total, current) => total + parseFloat(current.valueVi), 0);
                        moneyByYear.set(year, moneyByYear.get(year) + sum);
                    } else {
                        return 'Invalid date format';
                    }
                } else {
                    return 'Data is empty';
                }
            }
            // Chuyển đổi Map thành một đối tượng JavaScript
            let obj = Object.fromEntries(moneyByYear);
            // Chuyển đối tượng JavaScript thành chuỗi JSON
            let jsonString = JSON.stringify(obj);
            return jsonString;
        } else {
            return 'Booking data is empty';
        }
    } catch (e) {
        throw new Error(e);
    }
};


let totalMoneyOnMonthPerYear = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let results = await db.Booking.findAll()
            resolve(results)
        } catch {
            reject(e)
        }
    })
}
let getTotalCustomer = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let results = await db.Booking.findAll()
            resolve(results)
        } catch {
            reject(e)
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
    searchSpecialty: searchSpecialty,
    getTotalMoney: getTotalMoney,
    totalMoneyOnMonthPerYear: totalMoneyOnMonthPerYear,
    getTotalCustomer: getTotalCustomer
}
