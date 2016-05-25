var _ = require('lodash');

var allowedUsers = ['fabfire@gmail.com'];

var isAllowed = function (email) {
    var found = _.find(allowedUsers, function (item) {
        return item === email;
    });
    return found ? true : false;
};

exports.isAllowed = isAllowed;