var db = require('../database.js');

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
                var result = await dbStoredMethod('get_all_branches');
                return result;
            }
        },
        {
            method: 'GET',
            path: '/getBranchInfo',
            handler: async (request, h) => {
                var result = getBranchInfo();
                return result;
            }
        },
    ]
};

const dbStoredMethod = function(methodName) {
    return db.callStored(methodName);
};

const getTestServerStuff = function() {
    return 'If you can read this the server is setup correctly';
};

const getBranchInfo = function() {
    return 'Implement sql stuff here';
};