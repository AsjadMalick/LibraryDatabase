const JOI = require('@hapi/joi');
const BOOM = require('@hapi/boom');

module.exports = {
    schema: JOI.object({
        alphaWithSpace: JOI.string()
            .regex(/^[a-zA-Z ]+/)
            .min(1)
            .max(90),

        alphaNumericWithSpace: JOI.string()
            .regex(/^[a-zA-Z0-9 ]+/)
            .min(1)
            .max(90),

        jobPosition: JOI.string()
            .regex(/^[a-zA-Z ]+/)
            .min(1)
            .max(90),

        mediaName: JOI.string()
            .regex(/^[a-zA-Z0-9:_ ]+/)
            .min(1)
            .max(90),

        branchName: JOI.string()
            .regex(/^[a-zA-Z ]+/)
            .min(1)
            .max(90),

        address: JOI.string()
            .regex(/^[a-zA-Z0-9, ]+/)
            .min(1)
            .max(90),

        numeric: JOI.number()
            .integer()
            .min(0)
            .max(90),
    }),

    MESSAGES: {
        invalidName: "Names can only be alpha characters with spaces\n",
        invalidPosition: "Position titles can only be alpha characters with spaces\n",
        invalidMedia: "Book/Disc name can only be alphanumeric characters with colon(:) underscore(_) and space characters\n",
        invalidBranch: "Branch name can only be alpha characters with spaces\n",
        invalidAddress: "Address can only be alpha numeric strings with spaces\n",
        invalidDate: "Date must be in YYYY/MM/DD format\n",
        invalidIdNum: "ID must be a non negative integer\n",
        noParams: "This method requires parameters\n",
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