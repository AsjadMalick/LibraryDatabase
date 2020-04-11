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
            path: '/getBranchInfo',
            handler: async (request, h) => {
                var result = await getBranchInfo(request);
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
    ]
};

const getTestServerStuff = function() {
    return 'If you can read this the server is setup correctly';
};

const getBranchInfo = async function (request) {
    var stringifiedQuery = JSON.stringify(request.query);

    if(stringifiedQuery.length > 2 && !!request.query.attr && !!request.query.value) {

        var attributeToSearchBy = request.query.attr;
        var valueToTest = request.query.value;
        var arrayOfSingleVal = [`"${attributeToSearchBy}"`, valueToTest];
        var isValid = false;

        if(attributeToSearchBy === 'id') {   
            isValid = errorMSG.validateInput({'numeric': valueToTest});
        }
        else if(attributeToSearchBy === 'lname' || attributeToSearchBy === 'fname') {
            isValid = errorMSG.validateInput({'alphaWithSpace': valueToTest});
        }
        else if(attributeToSearchBy === 'position') {
            isValid = errorMSG.validateInput({'jobPosition': valueToTest});
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

const getVolunteerInfo = async function(request) {
  
    var stringifiedQuery = JSON.stringify(request.query);

    if(stringifiedQuery.length > 2 && !!request.query.attr && !!request.query.value) {

        var attributeToSearchBy = request.query.attr;
        var valueToTest = request.query.value;
        var arrayOfSingleVal = [];
        var isValid = false;

        if(attributeToSearchBy === 'id') {   
            isValid = errorMSG.validateInput({'numeric': valueToTest});
            arrayOfSingleVal = [`"${attributeToSearchBy}"`, valueToTest];
        }
        else if(attributeToSearchBy === 'lname' || attributeToSearchBy === 'fname') {
            isValid = errorMSG.validateInput({'alphaWithSpace': valueToTest});
            arrayOfSingleVal = [`"${attributeToSearchBy}"`, `"${valueToTest}"`];
        }
        else if(attributeToSearchBy === 'position') {
            isValid = errorMSG.validateInput({'jobPosition': valueToTest});
            arrayOfSingleVal = [`"${attributeToSearchBy}"`, `"${valueToTest}"`];
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