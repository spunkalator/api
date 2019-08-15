
const {validParam, sendErrorResponse, sendSuccessResponse, trimCollection} = require('../../helpers/utility');
const mongoose = require('mongoose');
const Users = mongoose.model('User');



exports.uploadImages = (req, res)  => {
    
    if (!req.body.image) {
            
            const image = {};
            image.url = req.file.url;
            image.id = req.file.public_id;

            if(image.url)
            {
                return sendSuccessResponse(res, {details: image}, 'Image Uploaded Successfully');
            }else{
                return sendErrorResponse(res, {}, 'Sotmething went wrong, Please try again');
            }
    
    }else{
        return sendErrorResponse(res, {}, 'File is required');
    } 
        
    
}



exports.deleteImage = (req, res)  => {

    if(req.body.image){
    
         return sendSuccessResponse(res, {}, 'Image Deleted');

    }else{
        return sendErrorResponse(res, {}, 'Image name is required');
        
    }
               
}
