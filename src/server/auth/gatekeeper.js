var _ = require('lodash');
var logger = require('../logger/index');

var allowedUsers = ['fabfire@gmail.com', 'fabien.fayard63@gmail.com'];

var isAllowed = function (email) {

    var found = _.find(allowedUsers, function (item) {
        return item === email;
    });
    logger.info('user %s wants to log : %s', email, found ? 'access granted' : 'access denied');
    return found ? true : false;
};

exports.isAllowed = isAllowed;