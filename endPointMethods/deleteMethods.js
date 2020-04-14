var db = require('../database.js');
var errorMSG = require('../errorHandling.js');

module.exports = {
   endPoints: [
        {
            method: 'DELETE',
            path: '/deleteEmployee',
            handler: async (request, h) => {
                var result = await deleteEmployee(request);
                return result;
            }
        },
        {
            method: 'DELETE',
            path: '/deleteVolunteer',
            handler: async (request, h) => {
                var result = await deleteVolunteer(request);
                return result;
            }
        },
        {
            method: 'DELETE',
            path: '/deleteBranch',
            handler: async (request, h) => {
                var result = await deleteBranch(request);
                return result;
            }
        },
        {
            method: 'DELETE',
            path: '/deletePatron',
            handler: async (request, h) => {
                var result = await deletePatron(request);
                return result;
            }
        },
        {
            method: 'DELETE',
            path: '/deleteBook',
            handler: async (request, h) => {
                var result = await deleteBook(request);
                return result;
            }
        },
        {
            method: 'DELETE',
            path: '/deleteDisc',
            handler: async (request, h) => {
                var result = await deleteDisc(request);
                return result;
            }
        },
        {
            method: 'DELETE',
            path: '/deleteProgram',
            handler: async (request, h) => {
                var result = await deleteProgram(request);
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
 * calls stored procedure that uses an ID to delete an entry
 * @param {any} request: the object holding the parameters
 * @param {any} tableName: name of table where entry will be deleted
 * @param {any} procedureCall: name of the stored procedure being called
 * @returns: either an error message string or a success message from the 'procedureCall'
 */
const deleteById = async function (request, tableName, procedureCall) {
    // check for mandatory variables
    var id = request.query.id;
    console.log(id);
    if (!!id) {
        // validate parameters;
        var isValidId = validateAttributeValuePair('id', id);
        if (isValidId === false) {
            return tableName + ' ' + getErrorMsgForAttribute('id');
        }
        // parameter form: (id)
        var parameters = [id];
        var result = await db.callStored(procedureCall, parameters);
        return result;

    } else {
        var errMsg = procedureCall + ` procedure requires 'id'` +
            ` parameter to delete an entry with the corresponding 'id'.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

/**
 * calls stored procedure that uses a name or string to delete an entry
 * @param {any} request: the object holding the parameters
 * @param {any} tableName: name of table where entry/s will be deleted
 * @param {any} procedureCall: name of the stored procedure being called
 * @returns: either an error message string or a success message from the 'procedureCall'
 */
const deleteByName = async function (request, tableName, procedureCall) {
    // check for mandatory variables
    var name = request.query.name;
    if (!!name) {

        // validate parameters;
        var isValidId = validateAttributeValuePair('name', name);
        if (isValidId === false) {
            return tableName + ' ' + getErrorMsgForAttribute('name');
        }
        // format parameters so they are valid
        name = '"' + name + '"';
        // parameter form: (name)
        var parameters = [name]
        // call procedure
        var result = await db.callStored(procedureCall, parameters);
        return result;

    } else {
        var errMsg = procedureCall + ` procedure requires 'name'` +
            ` parameters to delete an entry with the corresponding 'name'.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const deleteEmployee = async function (request) {

    return deleteById(request, 'Employee', 'deleteEmployee');
};

const deleteVolunteer = async function (request) {

    return deleteById(request, 'Volunteer', 'deleteVolunteer');
};


const deleteBranch = async function (request) {

    return deleteByName(request, 'Branch', 'deleteBranch');
};

const deletePatron = async function (request) {

    return deleteById(request, 'Patron', 'deletePatron');
};

const deleteBook = async function (request) {

    return deleteById(request, 'Book', 'deleteBook');
};

const deleteDisc = async function (request) {

    return deleteById(request, 'Disc', 'deleteDisc');
};

const deleteProgram = async function (request) {
    // check for mandatory variables
    var pName = request.query.pName;
    var bName = request.query.bName;
    if (!!pName && !!bName) {

        // validate parameters;
        var isValidName = validateAttributeValuePair('name', pName);
        if (isValidName === false) {
            return 'Program ' + getErrorMsgForAttribute('name');
        }
        var isValidName = validateAttributeValuePair('name', bName);
        if (isValidName === false) {
            return 'Branch ' + getErrorMsgForAttribute('name');
        }
        // format parameters so they are valid
        pName = '"' + pName + '"';
        bName = '"' + bName + '"';
        // parameter form: (branchName, programName)
        parameters = [bName, pName];
        // call procedure
        var result = await db.callStored('deleteProgram', parameters);
        return result;

    } else {
        var errMsg = `deleteProgram procedure requires 'pName' and bName` +
            ` parameters to delete a program with the name 'pName' from the branch 'bName'.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

