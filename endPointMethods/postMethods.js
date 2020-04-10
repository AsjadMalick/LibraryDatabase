var db = require('../database.js');
var errorMSG = require('../errorHandling.js');

module.exports = {
    endPoints: [
        {
            method: 'POST',
            path: '/createBranch',
            handler: async (request, h) => {
                var result = await createBranch(request);
                return result;
            }
        },
        {
            method: 'POST',
            path: '/createRoom',
            handler: async (request, h) => {
                var result = await createRoom(request);
                return result;
            }
        },
    ]
};

const createBranch = async function(request) {

    var stringifiedQuery = JSON.stringify(request.query);

    // ensure that name and address parameters are given
    if (stringifiedQuery.length > 2 && !!request.query.name && !!request.query.address) {
       
        var branchName = request.query.name;
        var branchAddress = request.query.address;
        console.log("branch name: %s", branchName);
        console.log("branch address: %s", branchAddress);
       
        // check parameter validity
        var isValid = errorMSG.validateInput({ 'alphaWithSpace': branchName });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidBranch);
        }
        isValid = errorMSG.validateInput({ 'address': branchAddress });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidAddress);
        }

        // invoke createBranch procedure
        var createBranchParameters = [branchName, branchAddress];
        var result = await db.callStored('createBranch', createBranchParameters);
        return result;

        
    } else {
        // This is where we do the select all version of the method call
        // But demonstrating the error message handling
        var errMsg = `${errorMSG.MESSAGES.noParams}Need 'name' parameter and 'address' parameter 
                                                                            to create a branch`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};


const createRoom = async function (request) {

    // check if parameters exists
    var branchName = request.query.branchName;
    var roomNumber = request.query.roomNumber;
    var capacity = request.query.capacity;
    if (!!branchName && !!roomNumber && !!capacity) {

        console.log(`branchName: %s`, branchName);
        console.log(`roomNumber: %s`, roomNumber);
        console.log(`capacity: %s`, capacity);
        // validate parameter values
        var isValid = errorMSG.validateInput({ 'alphaWithSpace': branchName }); 
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidBranch);
        }
        isValid = errorMSG.validateInput({ 'numeric': roomNumber }); 
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(`roomNumber must be a non-negative integer`);
        }
        isValid = errorMSG.validateInput({ 'numeric': capacity });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(`capacity must be a non-negative integer`);
        }

        // invoke createRoom procedure
        var createRoomParameters = [branchName, roomNumber, capacity];
        var result = await db.callStored('createRoom', createRoomParameters);
        return result;

    } else {
        var errMsg = `createRoom procedure requires 'branchName', 'roomNumber', and 'capacity'
                                                     parameters to create a room entry.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const 
