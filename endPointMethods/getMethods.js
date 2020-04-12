var db = require('../database.js');
var errorMSG = require('../errorHandling.js');

module.exports = {
    endPoints: [
        {
            method: 'GET',
            path: '/appTest',
            handler: async (request, h) => {
                var result = getTestServerStuff();
                return result;
            }
        },
        {
            method: 'GET',
            path: '/dbTest',
            handler: async (request, h) => {
                var result = await db.callStored('getAllBranches');
                return result;
            }
        },
        {
            method: 'GET',
            path: '/getBranch',
            handler: async (request, h) => {
                var result = await getBranchInfo(request);
                return result;
            }
        },
        {
            method: 'GET',
            path: '/getEmployee',
            handler: async (request, h) => {
                var result = await getEmployeeInfo(request);
                return result;
            }
        },
        {
            method: 'GET',
            path: '/getVolunteer',
            handler: async (request, h) => {
                var result = await getVolunteerInfo(request);
                return result;
            }
        },
        {
            method: 'GET',
            path: '/getPatron',
            handler: async (request, h) => {
                var result = await getPatronInfo(request);
                return result;
            }
        },
        {
            method: 'GET',
            path: '/getProgram',
            handler: async (request, h) => {
                var result = await getProgramInfo(request);
                return result;
            }
        },
        {
            method: 'GET',
            path: '/getRoom',
            handler: async (request, h) => {
                var result = await getRoomInfo(request);
                return result;
            }
        },
        {
            method: 'GET',
            path: '/getBook',
            handler: async (request, h) => {
                var result = await getMediaInfo(request, 'book');
                return result;
            }
        },
        {
            method: 'GET',
            path: '/getDisc',
            handler: async (request, h) => {
                var result = await getMediaInfo(request, 'disc');
                return result;
            }
        }
    ]
};

const getTestServerStuff = function() {
    return 'If you can read this the server is setup correctly';
};

const validateAnyAttributeAs = function(attrName, attrValue) {
    var isValid = false;
    var arrayOfSingleVal = [];

    if(attrName === 'bname') {   
        isValid = errorMSG.validateInput({'branchName': attrValue});
        arrayOfSingleVal = [`"${attrName}"`, `"${attrValue}"`];
    }
    else if(attrName === 'addr') {
        isValid = errorMSG.validateInput({'address': attrValue});
        arrayOfSingleVal = [`"${attrName}"`, `"${attrValue}"`];
    }
    else if (['id', 'eid', 'number', 'capacity'].indexOf(attrName) >= 0) {
        isValid = errorMSG.validateInput({'numeric': attrValue});
        arrayOfSingleVal = [`"${attrName}"`, attrValue];
    }
    else if (['fname', 'lname', 'name', 'type'].indexOf(attrName) >= 0) {
        isValid = errorMSG.validateInput({'alphaWithSpace': attrValue});
        arrayOfSingleVal = [`"${attrName}"`,`"${attrValue}"`];
    }
    else if (attrName === 'pos') {
        isValid = errorMSG.validateInput({'jobPosition': attrValue});
        arrayOfSingleVal = [`"${attrName}"`, `"${attrValue}"`];
    }
    else if (attrName === 'date') {
        isValid = errorMSG.validateInput({'dateFormat': attrValue});
        arrayOfSingleVal = [`"${attrName}"`, `"${attrValue}"`];
    }
    return [isValid, arrayOfSingleVal];
}

const getBranchInfo = async function (request) {
    var stringifiedQuery = JSON.stringify(request.query);

    if(stringifiedQuery.length > 2 && !!request.query.attr && !!request.query.value) {

        var attributeToSearchBy = request.query.attr;
        var valueToTest = request.query.value;
        var arrayOfSingleVal = [];
        var isValid = false;

        if(['bname', 'addr'].indexOf(attributeToSearchBy) >= 0) {   
            var validationResult = validateAnyAttributeAs(attributeToSearchBy, valueToTest);
            isValid = validationResult[0];
            arrayOfSingleVal = validationResult[1];
        }
        else {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidAttr);
        }

        var valToReturn = isValid ? 
                        await db.callStored('getBranchInfo1', arrayOfSingleVal) : 
                        errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidValue);
        return valToReturn;
       
    }
    else if(stringifiedQuery.length === 2) {
        return await db.callStored('getAllBranches', []);
    }
    else {
        return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.malformed);
    }
};

const getEmployeeInfo = async function(request) {
    var stringifiedQuery = JSON.stringify(request.query);

    if(stringifiedQuery.length > 2 && !!request.query.attr && !!request.query.value) {

        var attributeToSearchBy = request.query.attr;
        var valueToTest = request.query.value;
        var arrayOfSingleVal = [];
        var isValid = false;

        if (['id', 'lname', 'fname', 'bname', 'pos'].indexOf(attributeToSearchBy) >= 0) {
            var validationResult = validateAnyAttributeAs(attributeToSearchBy, valueToTest);
            isValid = validationResult[0];
            arrayOfSingleVal = validationResult[1];
        }
        else {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidAttr);
        }

        var valToReturn = isValid ? 
                        await db.callStored('getEmployeeInfo1', arrayOfSingleVal) : 
                        errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidValue);
        return valToReturn;
       
    }
    else if(stringifiedQuery.length === 2) {
        return await db.callStored('getAllEmployees', []);
    }
    else {
        return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.malformed);
    }
};

const getVolunteerInfo = async function(request) {
  
    var stringifiedQuery = JSON.stringify(request.query);

    if(stringifiedQuery.length > 2 && !!request.query.attr && !!request.query.value) {

        var attributeToSearchBy = request.query.attr;
        var valueToTest = request.query.value;
        var arrayOfSingleVal = [];
        var isValid = false;

        if(['id', 'lname', 'fname', 'pos'].indexOf(attributeToSearchBy) >= 0) {   
            var validationResult = validateAnyAttributeAs(attributeToSearchBy, valueToTest);
            isValid = validationResult[0];
            arrayOfSingleVal = validationResult[1];
        }
        else {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidAttr);
        }

        var valToReturn = isValid ? 
                        await db.callStored('getVolunteerInfo1', arrayOfSingleVal) : 
                        errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidValue);
        return valToReturn;
       
    }
    else if(stringifiedQuery.length === 2) {
        return await db.callStored('getAllVolunteers', []);
    }
    else {
        return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.malformed);
    }
};

const getPatronInfo = async function(request) {
    var stringifiedQuery = JSON.stringify(request.query);

    if(stringifiedQuery.length > 2 && !!request.query.attr && !!request.query.value) {

        var attributeToSearchBy = request.query.attr;
        var valueToTest = request.query.value;
        var arrayOfSingleVal = [];
        var isValid = false;

        if(['id', 'lname', 'fname', 'bname'].indexOf(attributeToSearchBy) >= 0 ) {   
            var validationResult = validateAnyAttributeAs(attributeToSearchBy, valueToTest);
            isValid = validationResult[0];
            arrayOfSingleVal = validationResult[1];
        }
        else {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidAttr);
        }

        var valToReturn = isValid ? 
                        await db.callStored('getPatronInfo1', arrayOfSingleVal) : 
                        errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidValue);
        return valToReturn;
       
    }
    else if(stringifiedQuery.length === 2) {
        return await db.callStored('getAllPatrons', []);
    }
    else {
        return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.malformed);
    }
}

const getProgramInfo = async function(request) {
    var stringifiedQuery = JSON.stringify(request.query);

    if(stringifiedQuery.length > 2 && !!request.query.attr && !!request.query.value) {

        var attributeToSearchBy = request.query.attr;
        var valueToTest = request.query.value;
        var arrayOfSingleVal = [];
        var isValid = false;

        if(['eid', 'name', 'bname', 'date', 'type'].indexOf(attributeToSearchBy) >= 0 ) {  
            var validationResult = validateAnyAttributeAs(attributeToSearchBy, valueToTest);
            isValid = validationResult[0];
            arrayOfSingleVal = validationResult[1];
        }
        else {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidAttr);
        }

        var valToReturn = isValid ? 
                        await db.callStored('getProgramInfo1', arrayOfSingleVal) : 
                        errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidValue);
        return valToReturn;
       
    }
    else if(stringifiedQuery.length === 2) {
        return await db.callStored('getAllPrograms', []);
    }
    else {
        return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.malformed);
    }
}

const getRoomInfo = async function(request) {
    var stringifiedQuery = JSON.stringify(request.query);

    if(stringifiedQuery.length > 2 && !!request.query.attr && !!request.query.value) {

        var attributeToSearchBy = request.query.attr;
        var valueToTest = request.query.value;
        var arrayOfSingleVal = [];
        var isValid = false;

        if(['number', 'id', 'bname', 'capacity'].indexOf(attributeToSearchBy) >= 0 ) {  
            var validationResult = validateAnyAttributeAs(attributeToSearchBy, valueToTest);
            isValid = validationResult[0];
            arrayOfSingleVal = validationResult[1];
        }
        else {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidAttr);
        }

        var valToReturn = isValid ? 
                        await db.callStored('getRoomInfo1', arrayOfSingleVal) : 
                        errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidValue);
        return valToReturn;
       
    }
    else if(stringifiedQuery.length === 2) {
        return await db.callStored('getAllRooms', []);
    }
    else {
        return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.malformed);
    }
}

const getMediaInfo = async function (request, mediaType) {

    var methodNames = mediaType === 'book' ? ['getBookInfo1', 'getAllBooks'] : ['getDiscInfo1', 'getAllDiscs']
   

    var stringifiedQuery = JSON.stringify(request.query);

    if(stringifiedQuery.length > 2 && !!request.query.attr && !!request.query.value) {

        var attributeToSearchBy = request.query.attr;
        var valueToTest = request.query.value;
        var arrayOfSingleVal = [];
        var isValid = false;

        if(['title', 'id', 'location'].indexOf(attributeToSearchBy) >= 0 ) {  
            var validationResult = validateAnyAttributeAs(attributeToSearchBy, valueToTest);
            isValid = validationResult[0];
            arrayOfSingleVal = validationResult[1];
        }
        else {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidAttr);
        }

        var valToReturn = isValid ? 
                        await db.callStored(methodNames[0], arrayOfSingleVal) : 
                        errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidValue);
        return valToReturn;
       
    }
    else if(stringifiedQuery.length === 2) {
        return await db.callStored(methodNames[1], []);
    }
    else {
        return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.malformed);
    }
}