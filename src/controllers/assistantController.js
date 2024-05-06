import assistantService from '../services/assistantService';

let TSPT3 = async (req, res) => {
    try {
        let response= await assistantService.TSPT3(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let TSPT4 = async (req, res) => {
    try {
        let response= await assistantService.TSPT4(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let UpdatePatient_Info = async(req,res) =>{
    try{
        let results= await assistantService.UpdatePatient_Info(req.body);

        if(results){
            return res.status(200).json(results);
        }
    }catch(e){
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getListPatientToCheck = async (req, res) => {
    try {

        let response = await assistantService.getListPatientToCheck(req.query.date);
        return res.status(200).json(response);
    } catch (e) {
        console.log('getListPatient', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getPendingDoctorRequests = async (req, res) => {
    try {
        if (req.query.patientId && !isNaN(req.query.patientId)) {
            // Xử lý logic khi patientId hợp lệ
            let result = await assistantService.getPendingDoctorRequests(req.query.patientId);

            return res.status(200).json(result);
        } else {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Invalid patientId'
            });
        }
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
}
let saveDoctorRequest = async (req, res) => {
    try {  
        const { id, data } = req.body;
        // Kiểm tra xem id có tồn tại và không phải là undefined
        if (!id) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Invalid patientId'
            });
        }
            // Xử lý logic khi patientId hợp lệ
            let result = await assistantService.saveDoctorRequest(id,data);

            return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
}
module.exports = {
    TSPT3:TSPT3,
    TSPT4:TSPT4,
    UpdatePatient_Info:UpdatePatient_Info,
    getListPatientToCheck:getListPatientToCheck,
    getPendingDoctorRequests:getPendingDoctorRequests,
    saveDoctorRequest:saveDoctorRequest,
}