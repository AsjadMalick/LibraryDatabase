const JOI = require('@hapi/joi');
const BOOM = require('@hapi/boom');

module.exports = {
    schema: JOI.object({
        alpha: JOI.string()
            .regex(/^[a-zA-Z]+$/)
            .min(1)
            .max(90),

        alphaWithSpace: JOI.string()
            .regex(/^[a-zA-Z ]+$/)
            .min(1)
            .max(90),

        alphaNumeric: JOI.string()
            .alphanum(),

        alphaNumericWithSpace: JOI.string()
            .regex(/^[a-zA-Z0-9 ]+$/)
            .min(1)
            .max(90),
        // yyyy-mm-dd format
        // also allows yyyy-m-d for single digit month or date
        dateFormat: JOI.string()
            .regex(/^([12]\d{3}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01]))$/),

        jobPosition: JOI.string()
            .regex(/^[a-zA-Z ]+$/)
            .min(1)
            .max(90),

        mediaName: JOI.string()
            .regex(/^[a-zA-Z0-9:_ ]+$/)
            .min(1)
            .max(90),

        branchName: JOI.string()
            .regex(/^[a-zA-Z ]+$/)
            .min(1)
            .max(90),

        address: JOI.string()
            .regex(/^[a-zA-Z0-9, ]+$/)
            .min(1)
            .max(90),

        numeric: JOI.string()
            .regex(/^[0-9]+$/)
            .min(1)
            .max(90),

        integer: JOI.number()
            .integer()
            .min(0),

        timeHHMM: JOI.string()
            .regex(/^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
            .min(4)
            .max(5),
    }),

    MESSAGES: {
        invalidName: "Names can only be alpha characters with spaces\n",
        invalidPosition: "Position titles can only be alpha characters with spaces\n",
        invalidMedia: "Book/Disc name can only be alphanumeric characters with colon(:) underscore(_) and space characters\n",
        invalidBranch: "Branch name can only be alpha characters with spaces\n",
        invalidAddress: "Address can only be alpha numeric strings with spaces\n",
        invalidDate: "Date must be in YYYY-MM-DD format\n",
        invalidIdNum: "ID must be a non negative integer\n",
        noParams: "This method requires parameters\n",
        invalidFirstName: "First names can only be alpha characters with spaces\n",
        invalidLastName: "Last names can only be alpha characters with spaces\n",
        invalidAlphaWithSpace: "can only be alpha characters with spaces\n",
        invalidAlphaNumericWithSpace: "can only be alphaNumeric characters with spaces\n",
        invalidNumeric: "can only be digits between 0-9\n",
        invalidInteger: "can only be a non negative integer\n",
        invalidTime: "Time must have the format HH:MM where hours are between 0-23\n"
    },

    validateInput: function(joiParams) {
        try {
            const {error, value} = this.schema.validate(joiParams);
            if(error === undefined) {
                return true;
            }
            else { 
                return false;
            }
        } catch (err) {
            return false;
        }
    },

    httpValidationErrorMessage: function (stringOfErrorMessages) {
        return BOOM.badRequest(stringOfErrorMessages);
    }
}