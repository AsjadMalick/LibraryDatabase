var db = require('../database.js');
var errorMSG = require('../errorHandling.js');

module.exports = {
   endPoints: [
        {
            method: 'PUT',
            path: '/updateEmployee',
            handler: async (request, h) => {
                var result = await updateEmployee(request);
                return result;
            }
        },
        {
            method: 'PUT',
            path: '/updateVolunteer',
            handler: async (request, h) => {
                var result = await updateVolunteer(request);
                return result;
            }
        },
        {
            method: 'PUT',
            path: '/updateBranch',
            handler: async (request, h) => {
                var result = await updateBranch(request);
                return result;
            }
        },
        {
            method: 'PUT',
            path: '/updatePatron',
            handler: async (request, h) => {
                var result = await updatePatron(request);
                return result;
            }
        },
        {
            method: 'PUT',
            path: '/updateRoom',
            handler: async (request, h) => {
                var result = await updateRoom(request);
                return result;
            }
        },
        {
            method: 'PUT',
            path: '/updateProgram',
            handler: async (request, h) => {
                var result = await updateProgram(request);
                return result;
            }
        },
        {
            method: 'PUT',
            path: '/updateBook',
            handler: async (request, h) => {
                var result = await updateBook(request);
                return result;
            }
        },
        {
            method: 'PUT',
            path: '/updateDisc',
            handler: async (request, h) => {
                var result = await updateDisc(request);
                return result;
            }
        },
   ]
};

/**
 * validates all kinds of attributes/columns used for PUT requests
 * @param {any} attributeName: column name of an existing table in the database
 * @param {any} value: corresponding value of the 'attributeName'
 */
const validateAttributeValuePair = function (attributeName, value) {
    var isValid = false;

    switch (attributeName) {
        case 'name':
        case 'bName':
        case 'fName':
        case 'lName':
        case 'pName':
        case 'pos':
        case 'type':
            isValid = errorMSG.validateInput({ alphaWithSpace: value });
            break;
        case 'id':
        case 'eId':
        case 'number':
            isValid = errorMSG.validateInput({ integer: value });
            break;
        case 'address':
            isValid = errorMSG.validateInput({ address: value });
            break;
        case 'date':
        case 'sDate':
            isValid = errorMSG.validateInput({ dateFormat: value });
            break;
        default:
            isValid = false;
    }

    return isValid;
};

/**
 * outputs the correct error message depending on the given 'attributeName'
 * @param {any} attributeName: name of a column from any table in the database
 * @returns string of the corresponding error message of the 'attributeName'
 */
const getErrorMsgForAttribute = function (attributeName) {
    var errorMessage = "";

    switch (attributeName) {
        case 'name':
        case 'bName':
        case 'fName':
        case 'lName':
        case 'pName':
        case 'pos':
        case 'type':
            errorMessage = attributeName + ' ' + errorMSG.MESSAGES.invalidAlphaWithSpace;
            break;
        case 'id':
        case 'eId':
        case 'number':
            errorMessage = attributeName + ' ' + errorMSG.MESSAGES.invalidInteger;
            break;
        case 'address':
            errorMessage = errorMSG.MESSAGES.invalidAddress;
            break;
        case 'date':
        case 'sDate':
            errorMessage = errorMSG.MESSAGES.invalidDate;
            break;
        default:
            errorMessage = attributeName + ' ' + errorMSG.MESSAGES.invalidAttr;
    }

    return errorMessage;
}

/**
 * calls stored procedure that uses an ID to search for an entry
 * @param {any} request: the object holding the parameters
 * @param {any} entityName: name of table being updated
 * @param {any} procedureCall: name of the stored procedure being called
 * @returns: either an error message string or a success message from the 'procedureCall'
 */
const updateById = async function (request, entityName, procedureCall) {
    // check for mandatory variables
    var id = request.query.id;
    var attributeName = request.query.attr;
    var value = request.query.value;
    if (!!id && !!attributeName && !!value) {

        // validate parameters;
        var isValidId = validateAttributeValuePair('id', id);
        if (isValidId === false) {
            return entityName + ' ' + getErrorMsgForAttribute('id');
        }
        var isValidPair = validateAttributeValuePair(attributeName, value);
        if (isValidPair === false) {
            return getErrorMsgForAttribute(attributeName);
        }
        // format parameters so they are valid
        attributeName = '"' + attributeName + '"';
        value = '"' + value + '"';  // strings are auto casted to integers in the database
        // parameter form: (id, attributeName, attributeValue)
        var parameters = [id, attributeName, value]
        // call procedure
        var result = await db.callStored(procedureCall, parameters);
        return result;

    } else {
        var errMsg = procedureCall + ` procedure requires 'id', 'attr' and 'value'` +
            ` parameters to update an entry with respect to the given 'id'.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

/**
 * calls stored procedure that uses a name or string to search for an entry
 * @param {any} request: the object holding the parameters
 * @param {any} entityName: name of table being updated
 * @param {any} procedureCall: name of the stored procedure being called
 * @returns: either an error message string or a success message from the 'procedureCall'
 */
const updateByName = async function (request, entityName, procedureCall) {
    // check for mandatory variables
    var name = request.query.name;
    var attributeName = request.query.attr;
    var value = request.query.value;
    if (!!name && !!attributeName && !!value) {

        // validate parameters;
        var isValidId = validateAttributeValuePair('name', name);
        if (isValidId === false) {
            return entityName + ' ' + getErrorMsgForAttribute('name');
        }
        var isValidPair = validateAttributeValuePair(attributeName, value);
        if (isValidPair === false) {
            return getErrorMsgForAttribute(attributeName);
        }
        // format parameters so they are valid
        name = '"' + name + '"';
        attributeName = '"' + attributeName + '"';
        value = '"' + value + '"';  // strings are auto casted to integers in the database
        // parameter form: (name, attributeName, attributeValue)
        var parameters = [name, attributeName, value]
        // call procedure
        var result = await db.callStored(procedureCall, parameters);
        return result;

    } else {
        var errMsg = procedureCall + ` procedure requires 'name', 'attr' and 'value'` +
            ` parameters to update an entry with respect to the given 'name'.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const updateEmployee = async function (request) {

    return updateById(request, 'Employee', 'updateEmployee');
};

const updateVolunteer = async function (request) {

    return updateById(request, 'Volunteer', 'updateVolunteer');
};

const updateBranch = async function (request) {

    return updateByName(request, 'Branch', 'updateBranch');
};

const updatePatron = async function (request) {

    return updateById(request, 'Patron', 'updatePatron');
};

const updateRoom = async function (request) {
    // check for mandatory variables
    var bName = request.query.bName;
    var rNumber = request.query.rNumber;
    var attributeName = request.query.attr;
    var value = request.query.value;
    if (!!bName && !!rNumber && !!attributeName && !!value) {

        // validate parameters;
        var isValidName = validateAttributeValuePair('bName', bName);
        if (isValidName === false) {
            return 'Branch ' + getErrorMsgForAttribute('name');
        }
        var isValidNumber = validateAttributeValuePair('number', rNumber);
        if (isValidNumber === false) {
            return 'Room ' + getErrorMsgForAttribute('number');
        }
        var isValidPair = validateAttributeValuePair(attributeName, value);
        if (isValidPair === false) {
            return getErrorMsgForAttribute(attributeName);
        }
        // format parameters so they are valid
        bName = '"' + bName + '"';
        attributeName = '"' + attributeName + '"';
        value = '"' + value + '"';  // strings are auto casted to integers in the database
        // parameter form: (branchName, roomNumber, attributeName, attributeValue)
        var parameters = [bName, rNumber, attributeName, value]
        // call procedure
        var result = await db.callStored('updateRoom', parameters);
        return result;

    } else {
        var errMsg =  `updateRoom procedure requires 'bName', 'rNumber', 'attr' and 'value'` +
            ` parameters to update a room with respect to the given 'bName' and 'rNumber'.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const updateProgram = async function (request) {
    // check for mandatory variables
    var pName = request.query.pName;
    var bName = request.query.bName;
    var attributeName = request.query.attr;
    var value = request.query.value;
    if (!!pName && !!bName && !!attributeName && !!value) {

        // validate parameters;
        var isValidPname = validateAttributeValuePair('name', pName);
        if (isValidPname === false) {
            return 'Program ' + getErrorMsgForAttribute('name');
        }
        var isValidBname = validateAttributeValuePair('name', bName);
        if (isValidBname === false) {
            return 'Branch ' + getErrorMsgForAttribute('name');
        }
        var isValidPair = validateAttributeValuePair(attributeName, value);
        if (isValidPair === false) {
            return getErrorMsgForAttribute(attributeName);
        }
        // format parameters so they are valid
        pName = '"' + pName + '"';
        bName = '"' + bName + '"';
        attributeName = '"' + attributeName + '"';
        value = '"' + value + '"';  // strings are auto casted to integers in the database
        // parameter form: (programName, branchName, attributeName, attributeValue)
        var parameters = [pName, bName, attributeName, value]
        // call procedure
        var result = await db.callStored('updateProgram', parameters);
        return result;

    } else {
        var errMsg = `updateRoom procedure requires 'pName', 'bName', 'attr' and 'value'` +
            ` parameters to update a program with respect to the given 'pName' and 'bName'.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const updateBook = async function (request) {

    return updateById(request, 'Book', 'updateBook');
};

const updateDisc = async function (request) {

    return updateById(request, 'Disc', 'updateDisc');
};