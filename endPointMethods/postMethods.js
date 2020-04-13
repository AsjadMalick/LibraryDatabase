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
        {
            method: 'POST',
            path: '/createEmployee',
            handler: async (request, h) => {
                var result = await createEmployee(request);
                return result;
            }
        },
        {
            method: 'POST',
            path: '/createVolunteer',
            handler: async (request, h) => {
                var result = await createVolunteer(request);
                return result;
            }
        },
        {
            method: 'POST',
            path: '/createProgram',
            handler: async (request, h) => {
                var result = await createProgram(request);
                return result;
            }
        },
        {
            method: 'POST',
            path: '/createPatron',
            handler: async (request, h) => {
                var result = await createPatron(request);
                return result;
            }
        },
        {
            method: 'POST',
            path: '/createBook',
            handler: async (request, h) => {
                var result = await createBook(request);
                return result;
            }
        },
        {
            method: 'POST',
            path: '/createDisc',
            handler: async (request, h) => {
                var result = await createDisc(request);
                return result;
            }
        },
        {
            method: 'POST',
            path: '/reserveRoom',
            handler: async (request, h) => {
                var result = await reserveRoom(request);
                return result;
            }
        },
        {
            method: 'POST',
            path: '/borrowBook',
            handler: async (request, h) => {
                var result = await borrowBook(request);
                return result;
            }
        },
        {
            method: 'POST',
            path: '/borrowDisc',
            handler: async (request, h) => {
                var result = await borrowDisc(request);
                return result;
            }
        },
        {
            method: 'POST',
            path: '/returnBook',
            handler: async (request, h) => {
                var result = await returnBook(request);
                return result;
            }
        },
        {
            method: 'POST',
            path: '/returnDisc',
            handler: async (request, h) => {
                var result = await returnDisc(request);
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
        var createBranchParameters = [`"${branchName}"`, `"${branchAddress}"`];
        var result = await db.callStored('createBranch', createBranchParameters);
        return result;

        
    } else {
        // This is where we do the select all version of the method call
        // But demonstrating the error message handling
        var errMsg = `${errorMSG.MESSAGES.noParams}Need 'name' parameter and 'address' parameter to create a branch`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};


const createRoom = async function(request) {
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

        // format parameters so they are valid
        branchName = '"' + branchName + '"';  // string parameters need quotation marks otherwise we get an error
        parameters = [branchName, roomNumber, capacity];
        // invoke createRoom procedure
        var result = await db.callStored('createRoom', parameters);
        return result;

    } else {
        var errMsg = `createRoom procedure requires 'branchName', 'roomNumber', and 'capacity' parameters to create a room entry.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const createEmployee = async function (request) {
    // check if parameters exists
    var branchName = request.query.branchName;
    var firstName = request.query.firstName;
    var lastName = request.query.lastName;
    var position = request.query.position;
    if (!!branchName && !!firstName && !!lastName && !!position) {

        console.log('branchName: %s', branchName);
        console.log('firstName: %s', firstName);
        console.log('lastName: %s', lastName);
        console.log('position: %s', position);
        // validate values
        var isValid = errorMSG.validateInput({ 'alphaWithSpace': branchName }); 
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidBranch);
        }
        isValid = errorMSG.validateInput({ 'alphaWithSpace': firstName });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(`firstName must only be alphabet and space characters`);
        }
        isValid = errorMSG.validateInput({ 'alphaWithSpace': lastName });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(`lastName must only be alphabet and space characters`);
        }
        isValid = errorMSG.validateInput({ 'alphaWithSpace': position });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidPosition);
        }

        // format parameters so they are valid
        branchName = '"' + branchName + '"';  // string parameters need quotation marks otherwise we get an error
        firstName = '"' + firstName + '"';
        lastName = '"' + lastName + '"';
        position = '"' + position + '"';
        parameters = [branchName, firstName, lastName, position];
        // invoke createEmployee procedure
        var result = await db.callStored('createEmployee', parameters);
        return result;


    } else {
        var errMsg = `createEmployee procedure requires 'branchName', 'firstName', 'lastName' and 'position' parameters to add new employee.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const createVolunteer = async function (request) {
    // check if parameters exists
    var firstName = request.query.firstName;
    var lastName = request.query.lastName;
    var position = request.query.position;
    if (!!firstName && !!lastName && !!position) {

        console.log("firstName: %s", firstName);
        console.log("lastName: %s", lastName);
        console.log("position: %s", position);
        // validate values
        var isValid = errorMSG.validateInput({ 'alphaWithSpace': firstName });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('firstName must only be alphabet and space characters');
        }
        isValid = errorMSG.validateInput({ 'alphaWithSpace': lastName });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('firstName must only be alphabet and space characters');
        }
        isValid = errorMSG.validateInput({ 'alphaWithSpace': position });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidPosition);
        }

        // format parameters so they are valid
        firstName = '"' + firstName + '"';  // string parameters need quotation marks otherwise we get an error
        lastName = '"' + lastName + '"';
        position = '"' + position + '"';
        parameters = [firstName, lastName, position];
        // call createVolunter procedure
        var result = await db.callStored('createVolunteer', parameters);
        return result;

    } else {
        var errMsg = `createVolunteer procedure requires 'firstName', 'lastName', and 'position' parameters to create a volunteer entry.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const createProgram = async function (request) {
    // check if mandatory parameters exist
    var programName = request.query.programName;
    var branchName = request.query.branchName;
    if (!!programName && !!branchName) {

        // validate values
        var isValid = errorMSG.validateInput({ 'alphaWithSpace': programName });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('programName must only be alphabet and space characters');
        }
        isValid = errorMSG.validateInput({ 'alphaWithSpace': branchName });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidBranch);
        }

        // format parameters so they are valid
        branchName = '"' + branchName + '"';  // string parameters need quotation marks otherwise we get an error
        programName = '"' + programName + '"';
        // form = (programName, employeeId, branchName, date, type)
        parameters = [programName, "null", branchName, "null", "null"];

        // check for optional parameters
        var employeeId = request.query.employeeId;
        var startDate = request.query.startDate;
        var programType = request.query.programType;
        if (!!employeeId) {
            if (errorMSG.validateInput({ 'numeric': employeeId }) === true) {
                parameters[1] = employeeId;

            } else {
                return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidIdNum);
            }
        }
        if (!!startDate) {
            if (errorMSG.validateInput({ 'dateFormat': startDate }) === true) {
                parameters[3] = '"' + startDate + '"';

            } else {
                return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidDate);
            }
        }
        if (!!programType) {
            if (errorMSG.validateInput({ 'alphaWithSpace': programType }) === true) {
                parameters[4] = '"' + programType + '"';

            } else {
                return errorMSG.httpValidationErrorMessage("programType must only be alphabet and space characters");
            }
        }
        // call createProgram procedure
        var result = await db.callStored('createProgram', parameters);
        return result;

    } else {
        var errMsg = `createProgram procedure requires 'programName', and 'branchName' parameters` +
                        ` to create a program entry with optional 'employeeId',` +
                        ` 'startDate' and 'programType' parameters.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const createPatron = async function (request) {
    // check if mandatory parameters exist
    var branchName = request.query.branchName;
    var firstName = request.query.firstName;
    var lastName = request.query.lastName;
    if (!!branchName && !!firstName && !!lastName) {

        // validate values
        var isValid = errorMSG.validateInput({ 'alphaWithSpace': branchName });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidBranch);
        }
        isValid = errorMSG.validateInput({ 'alphaWithSpace': firstName });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidFirstName);
        }
        isValid = errorMSG.validateInput({ 'alphaWithSpace': lastName });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidLastName);
        }
        // format parameters so they are valid
        branchName = '"' + branchName + '"';  // string parameters need quotation marks otherwise we get an error
        firstName = '"' + firstName + '"';
        lastName = '"' + lastName + '"';
        // parameter form = (branchName, firstName, lastName)
        parameters = [branchName, firstName, lastName];
        // call createPatron
        var result = await db.callStored('createPatron', parameters);
        return result;

    } else {
        var errMsg = `createPatron procedure requires 'branchName', 'firstName', and 'lastName' parameters` +
                            ` to create a program entry.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const createBook = async function (request) {
    // check if mandatory parameters exist
    var name = request.query.name;
    if (!!name) {

        // validate values
        var isValid = errorMSG.validateInput({ alphaNumericWithSpace: name });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Book names '
                + errorMSG.MESSAGES.invalidAlphaNumericWithSpace);
        }
        // format parameters so they are valid
        name = '"' + name + '"';
        // parameter form: (name)
        var parameters = [name];
        // call createBook procedure
        var result = await db.callStored('createBook', parameters);
        return result;

    } else {
        var errMsg = `createBook procedure requires 'name' parameter to create a book entry.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const createDisc = async function (request) {
    // check if mandatory parameters exist
    var name = request.query.name;
    if (!!name) {

        // validate values
        var isValid = errorMSG.validateInput({ alphaNumericWithSpace: name });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Disc names '
                + errorMSG.MESSAGES.invalidAlphaNumericWithSpace);
        }
        // format parameters so they are valid
        name = '"' + name + '"';
        // parameter form: (name)
        var parameters = [name, '"unknown"'];
        // call createBook procedure
        var result = await db.callStored('createDisc', parameters);
        return result;

    } else {
        var errMsg = `createDisc procedure requires 'name' parameter to create a disc entry.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const reserveRoom = async function (request) {
    // check if mandatory parameters exists
    var cardNumber = request.query.cardNumber;
    var roomId = request.query.roomId;
    var date = request.query.date;
    var time = request.query.time;
    if (!!cardNumber && !!roomId && !!date && !!time) {

        // validate values
        var isValid = errorMSG.validateInput({ numeric: cardNumber });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Card number '
                + errorMSG.MESSAGES.invalidNumeric);
        }
        isValid = errorMSG.validateInput({ integer: roomId });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Room id\'s '
                + errorMSG.MESSAGES.invalidInteger);
        }
        isValid = errorMSG.validateInput({ dateFormat: date });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidDate);
        }
        isValid = errorMSG.validateInput({ timeHHMM: time });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidTime);
        }
        // format parameters so they are valid
        date = '"' + date + '"';
        time = '"' + time + '"';
        // parameter form: (cardNumber, roomId, reservationDate, reservationTime)
        parameters = [cardNumber, roomId, date, time];
        // call reserveRoom procedure
        var result = await db.callStored('reserveRoom', parameters);
        return result;

    } else {
        var errMsg = `reserveRoom procedure requires 'cardNumber', 'roomId', and 'date'` +
                            ` parameter to create a room reservation entry.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }

};

const borrowBook = async function (request) {
    // check if mandatory parameters exist
    var bookId = request.query.bookId;
    var cardNumber = request.query.cardNumber;
    var dueDate = request.query.dueDate;
    if (!!bookId && !!cardNumber && !!dueDate) {

        // validate values
        var isValid = errorMSG.validateInput({ integer: bookId });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Book IDs '
                + errorMSG.MESSAGES.invalidInteger);
        }
        isValid = errorMSG.validateInput({ numeric: cardNumber });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Card Number '
                + errorMSG.MESSAGES.invalidNumeric);
        }
        isValid = errorMSG.validateInput({ dateFormat: dueDate });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidDate);
        }
        // format parameters so they are valid
        dueDate = '"' + dueDate + '"';
        // parameter form: (bookId, cardNumber, dueDate)
        var parameters = [bookId, cardNumber, dueDate];
        // call borrowBook procedure
        var result = await db.callStored('borrowBook', parameters);
        return result;

    } else {errorMSG.validateInput({ numeric: cardNumber });
        var errMsg = `borrowBook procedure requires 'bookId', 'cardNumber', and 'dueDate'` +
                            ` parameter to borrow a book.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const borrowDisc = async function (request) {
    var discId = request.query.discId;
    var cardNumber = request.query.cardNumber;
    var dueDate = request.query.dueDate;
    if (!!discId && !!cardNumber && !!dueDate) {

        // validate values
        var isValid = errorMSG.validateInput({ integer: discId });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Disc IDs '
                + errorMSG.MESSAGES.invalidInteger);
        }
        isValid = errorMSG.validateInput({ numeric: cardNumber });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Card Number '
                + errorMSG.MESSAGES.invalidNumeric);
        }
        isValid = errorMSG.validateInput({ dateFormat: dueDate });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage(errorMSG.MESSAGES.invalidDate);
        }
        // format parameters so they are valid
        dueDate = '"' + dueDate + '"';
        // parameter form: (discId, cardNumber, dueDate)
        var parameters = [discId, cardNumber, dueDate];
        // call borrowBook procedure
        var result = await db.callStored('borrowDisc', parameters);
        return result;

    } else {
        errorMSG.validateInput({ numeric: cardNumber });
        var errMsg = `borrowDisc procedure requires 'discId', 'cardNumber', and 'dueDate'` +
            ` parameter to borrow a disc.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const returnBook = async function (request) {
    // check if mandatory parameters exist
    var bookId = request.query.bookId;
    var cardNumber = request.query.cardNumber;
    if (!!bookId && !!cardNumber) {

        // validate values
        var isValid = errorMSG.validateInput({ integer: bookId });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Book IDs '
                + errorMSG.MESSAGES.invalidInteger);
        }
        isValid = errorMSG.validateInput({ numeric: cardNumber });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Card Number '
                + errorMSG.MESSAGES.invalidNumeric);
        }
        // parameter form: (bookId, cardNumber)
        var parameters = [bookId, cardNumber];
        // call returnBook procedure
        var result = await db.callStored('returnBook', parameters);
        return result;

    } else {
        var errMsg = `returnBook procedure requires 'bookId', and 'cardNumber'` +
            ` parameters to return a book.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};

const returnDisc = async function (request) {
    // check if mandatory parameters exist
    var discId = request.query.discId;
    var cardNumber = request.query.cardNumber;
    if (!!discId && !!cardNumber) {

        // validate values
        var isValid = errorMSG.validateInput({ integer: discId });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Book IDs '
                + errorMSG.MESSAGES.invalidInteger);
        }
        isValid = errorMSG.validateInput({ numeric: cardNumber });
        if (isValid === false) {
            return errorMSG.httpValidationErrorMessage('Card Number '
                + errorMSG.MESSAGES.invalidNumeric);
        }
        // parameter form: (discId, cardNumber)
        var parameters = [discId, cardNumber];
        // call returnDisc procedure
        var result = await db.callStored('returnDisc', parameters);
        return result;

    } else {
        var errMsg = `returnDisc procedure requires 'discId', and 'cardNumber'` +
            ` parameters to return a disc.`;
        return errorMSG.httpValidationErrorMessage(errMsg);
    }
};