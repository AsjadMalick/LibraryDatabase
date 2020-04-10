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
                var result = await db.callStored('get_all_branches');
                return result;
            }
        },
        {
            method: 'GET',
            path: '/getBranchInfo',
            handler: async (request, h) => {
                var result = await db.callStored('get_all_branches');
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

//At the time of making the code findVolunteer only had an id version
//************************THE ASYNC KEYWORD IS VERY IMPORTANT**************************************
const getVolunteerInfo = async function(request) {
    
    //This is to just test the string easily, if the length is 2 or less it means the string is {} i.e no params passed
    var stringifiedQuery = JSON.stringify(request.query);

    //Empty JSON note JS does lazy evaluation, and thats taken fully advantage of here
    //The first check is to see the length of the string as mentioned above
    //The next check is to see if a attr variable is in the query (note the !! is important)
    //The final check is to see if a value variable is in the query (note the !! is important)
    if(stringifiedQuery.length > 2 && !!request.query.attr && !!request.query.value) {

        //Get the attribute to search by
        var attributeToSearchBY = request.query.attr;

        //If we need to search by id
        if(attributeToSearchBY === 'id') {
            //Get the value we need to test, we know it must be validated against id
            var valueToTest = request.query.value;

            //Validate the input against the idNumbers in the schema object
            var isValid = errorMSG.validateInput({'numeric': valueToTest});
            if(isValid === true) {
                //This is just how i defined the method, its scaleable to multiple 
                //Call the method
                var arrayOfSingleVal = [valueToTest];
                var result = await db.callStored('findVolunteer', arrayOfSingleVal);
                return result;
            }
            else {
                return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidIdNum);
            }
        }
        else {
            return 'cant handle this yet fam until method implemented on sql side';
        }
    }
    else {
        // This is where we do the select all version of the method call
        // But demonstrating the error message handling
        var errMsg = `${errorMSG.MESSAGES.noParams}Need 'attr' parameter and 'value parameter'`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};