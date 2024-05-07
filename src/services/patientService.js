import db from '../models'
require('dotenv').config()
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid'

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.email ||
                !data.doctorId ||
                !data.timeType ||
                !data.date ||
                !data.fullName ||
                !data.selectedGender ||
                !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let token = uuidv4()
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })

                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                        phonenumber: data.phonenumber
                    }
                })

                //create a booking record
                if (user && user[0]) {
                    let booking = await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            date: '' + data.date
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })

                    let patient = await db.Patient_Infor.findOrCreate({
                        where: {
                            patientId: user[0].id
                        },
                        defaults: {
                            patientId: user[0].id,
                            birthday: data.birthday,
                            reason: data.reason
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient succeed!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment succeed!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let sendComment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.name || !data.content) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let patient = await db.User.findOne({
                    where: {
                        email: data.email
                    },
                    attributes: ['id'],
                    // include: [
                    //     {
                    //         model: db.Booking, as: 'patientData',
                    //         attributes: ['patientId']
                    //     },
                    // ],
                    raw: false,
                    nest: true
                })

                //search status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        statusId: 'S3',
                        patientId: patient.id
                    },
                    raw: false
                })

                if (appointment) {
                    await db.Comment.create({
                        doctorId: data.doctorId,
                        name: data.name,
                        email: data.email,
                        content: data.content
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getListCommentForPatient = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Comment.findAll({
                    where: {
                        doctorId: doctorId
                    },
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

let getDetailPatientById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Patient_Infor.findOne({
                    where: {
                        patientId: inputId
                    },
                    include: [
                        {
                            model: db.History,
                            attributes: ['description', 'files']
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

let editDetailPatient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.patientId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let patientInfor = await db.Patient_Infor.findOne({
                    where: { patientId: data.patientId },
                    raw: false
                })
                if (patientInfor) {
                    // thêm -F để biết chưa xác nhận từ Hộ lí
                    let PendingDoctorRequest = data.doctorRequest.map((item) => item + '-F')
                    // kết thúc bằng '-T' đã hoàn thành và ko thay đổi
                    let newDoctorRequests = []
                    if (patientInfor && patientInfor.doctorRequest) {
                        newDoctorRequests = patientInfor.doctorRequest.filter((item) => item.includes('-T'))
                        // Tiếp tục xử lý với biến newDoctorRequests đã được lọc
                    }

                    //update
                    patientInfor.reason = data.reason
                    patientInfor.statusUpdate = data.statusUpdate
                    patientInfor.doctorRequest = [...PendingDoctorRequest, ...newDoctorRequests]
                    await patientInfor.save()
                }

                resolve({
                    errCode: 0,
                    errMessage: 'edit infor patient succeed!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    sendComment: sendComment,
    getListCommentForPatient: getListCommentForPatient,
    getDetailPatientById: getDetailPatientById,
    editDetailPatient: editDetailPatient
}
