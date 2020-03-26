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
            path: '/getBranchInfo',
            handler: async (request, h) => {
                var result = getBranchInfo();
                return result;
            }
        },
    ]
};

const getTestServerStuff = function() {
    return 'If you can read this the server is setup correctly';
};

const getBranchInfo = function() {
    return 'Implement sql stuff here';
};