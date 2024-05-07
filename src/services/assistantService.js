import db from '../models'
require('dotenv').config()

let TSPT3 = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await db.Booking.findOne({
                where: {
                    id: data.id
                },
                raw: false
            })
            if (result) {
                result.statusId = 'S3'
                await result.save()
            }
            resolve({
                errCode: 0,
                errMessage: 'OK'
            })
        } catch (e) {
            reject(e)
        }
    })
}
let TSPT4 = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await db.Booking.findOne({
                where: {
                    id: data.id
                },
                raw: false
            })
            if (result) {
                result.statusId = 'S4'
                await result.save()
            }
            resolve({
                errCode: 0,
                errMessage: 'OK'
            })
        } catch (e) {
            reject(e)
        }
    })
}
let UpdatePatient_Info = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await db.Patient_Infor.findOne({
                where: {
                    patientId: data.patientId
                },
                raw: false
            })
            if (result) {
                // Thực hiện cập nhật thông tin của bệnh nhân dựa trên dữ liệu từ frontend
                result.personalHistory = data.personalHistory
                result.bloodGroup = data.bloodGroup
                result.bloodPressure = data.bloodPressure
                result.weight = data.weight
                result.height = data.height
                result.temperature = data.temperature
                // Lưu các thay đổi vào cơ sở dữ liệu
                await result.save()
                resolve({
                    errCode: 0,
                    errMessage: 'Thông tin bệnh nhân đã được cập nhật thành công'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy bệnh nhân'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getListPatientToCheck = (date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        date: date,
                        statusId: 'S3'
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['id', 'email', 'firstName', 'address', 'gender', 'phonenumber'],
                            include: [{ model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }]
                        },
                        {
                            model: db.Allcode,
                            as: 'timeTypeDataPatient',
                            attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
let getPendingDoctorRequests = async (patientId) => {
    try {
        if (!patientId) {
            return {
                errCode: 4,
                errMessage: 'Missing patient ID'
            }
        }
        let result = await db.Patient_Infor.findOne({
            where: { patientId: patientId },
            raw: false
        })
        if (!result) {
            return {
                errCode: 2,
                errMessage: 'Patient not found in database'
            }
        }
        let pendingDoctorRequests = result.doctorRequest.filter((item) => item.endsWith('-F'))
        // let afterSlicePendingDoctorRequests = pendingDoctorRequests.map((item)=>item.slice(0,-2));
        if (pendingDoctorRequests.length === 0) {
            return {
                errCode: 3,
                errMessage: 'No pending doctor requests'
            }
        }
        return {
            errCode: 0,
            errMessage: 'Success',
            pendingDoctorRequests: pendingDoctorRequests
        }
    } catch (e) {
        throw e
    }
}

let saveDoctorRequest = async (id, data) => {
    try {
        // Tìm kiếm thông tin bệnh nhân
        let patientInfo = await db.Patient_Infor.findOne({
            where: { patientId: id },
            raw: false
        })

        if (!patientInfo) {
            return {
                errCode: 1,
                errMessage: 'Patient info not found for the provided ID.'
            }
        }

        // Xử lý dữ liệu và lưu vào cơ sở dữ liệu
        let checkedArray = data.map((item) => item.slice(0, -2).concat('-T'))
        let filteredArray = patientInfo.doctorRequest.filter((item) => !data.includes(item))
        let afterFilteredArray = filteredArray.concat(checkedArray)
        patientInfo.doctorRequest = afterFilteredArray
        await patientInfo.save()
        return {
            errCode: 0,
            errMessage: 'Save patient info success',
            afterFilteredArray: afterFilteredArray
        }
    } catch (e) {
        console.error('Error in saveDoctorRequest service:', e)
        throw e // Chuyển tiếp lỗi để controller xử lý
    }
}
module.exports = {
    TSPT3: TSPT3,
    TSPT4: TSPT4,
    UpdatePatient_Info: UpdatePatient_Info,
    getListPatientToCheck: getListPatientToCheck,
    getPendingDoctorRequests: getPendingDoctorRequests,
    saveDoctorRequest: saveDoctorRequest
}
