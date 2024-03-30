import express from 'express'
import homeControllers from '../controllers/homeControllers'
import userController from '../controllers/userController'
import doctorController from '../controllers/doctorController'
import patientController from '../controllers/patientController'
import specialtyController from '../controllers/specialtyController'
import clinicController from '../controllers/clinicController'
import handBookController from '../controllers/handBookController'
const PaymentRouter = require('./PaymentRouter')

let router = express.Router()

let initWebRoutes = (app) => {
    router.get('/', homeControllers.getHomePage)
    router.get('/crud', homeControllers.getCRUD)
    router.post('/post-crud', homeControllers.postCRUD)
    router.get('/get-crud', homeControllers.dislayGetCRUD)
    router.get('/edit-crud', homeControllers.getEditCRUD)
    router.post('/put-crud', homeControllers.putCRUD)
    router.get('/delete-crud', homeControllers.deleteCRUD)

    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser) //RestAPI
    router.get('/api/allcode', userController.getAllcode)
    router.get('/api/get-barchart', userController.dataForBarChart)
    router.get('/api/search', userController.search)

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)
    router.post('/api/save-infor-doctors', doctorController.postInforDoctor)
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)
    router.post('/api/send-remedy', doctorController.sendRemedy)
    router.get('/api/get-clinic-doctor-by-id', doctorController.getClinicDoctorById)

    router.post('/api/patient-book-appointment', patientController.postBookAppointment)
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment)
    router.post('/api/send-comment', patientController.sendComment)
    router.get('/api/get-list-comment-for-patient', patientController.getListCommentForPatient)
    router.get('/api/get-detail-patient-by-id', patientController.getDetailPatientById)
    router.post('/api/edit-detail-patient', patientController.editDetailPatient)
    router.get('/api/get-list-patient',doctorController.getListPatient)
    router.post('/api/create-new-specialty', specialtyController.createSpecialty)
    router.get('/api/get-specialty', specialtyController.getAllSpecialty)
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)
    router.post('/api/create-new-clinic', clinicController.createClinic)
    router.get('/api/get-clinic', clinicController.getAllClinic)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)
    router.get('/api/total-money', userController.totalMoney)
    router.post('/api/create-new-handbook', handBookController.createHandbook)
    router.get('/api/get-handbooks', handBookController.getAllHandbook)
    router.get('/api/get-detail-handbook-by-id', handBookController.getDetailHandbookById)
    router.get('/api/get-All-Customer', userController.getAllCustomer)
    app.use('/api/payment', PaymentRouter)
    return app.use('/', router)
}

module.exports = initWebRoutes
