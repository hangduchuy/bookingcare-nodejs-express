import patientService from '../services/patientService'

let postBookAppointment = async (req, res) => {
    try {
        let response = await patientService.postBookAppointment(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log('postBookAppointment', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let response = await patientService.postVerifyBookAppointment(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log('postVerifyBookAppointment', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let sendComment = async (req, res) => {
    try {
        let response = await patientService.sendComment(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log('sendComment', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getListCommentForPatient = async (req, res) => {
    try {
        let response = await patientService.getListCommentForPatient(req.query.doctorId)
        return res.status(200).json(response)
    } catch (e) {
        console.log('getListCommentForPatient', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailPatientById = async (req, res) => {
    try {
        let response = await patientService.getDetailPatientById(req.query.patientId)
        return res.status(200).json(response)
    } catch (e) {
        console.log('getDetailPatientById', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let editDetailPatient = async (req, res) => {
    try {
        let response = await patientService.editDetailPatient(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log('editDetailPatient', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    sendComment: sendComment,
    getListCommentForPatient: getListCommentForPatient,
    getDetailPatientById: getDetailPatientById,
    editDetailPatient: editDetailPatient
}
