import handBookService from '../services/handBookService';

let createHandbook = async (req, res) => {
    try {
        let response = await handBookService.createHandbook(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log('createHandbook', e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllHandbook = async (req, res) => {
    try {
        let response = await handBookService.getAllHandbook();
        return res.status(200).json(response);
    } catch (e) {
        console.log('getAllHandbook', e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailHandbookById = async (req, res) => {
    try {
        let response = await handBookService.getDetailHandbookById(req.query.id);
        return res.status(200).json(response);
    } catch (e) {
        console.log('getDetailHandbookById', e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    createHandbook:createHandbook,
    getAllHandbook:getAllHandbook,
    getDetailHandbookById:getDetailHandbookById,
}