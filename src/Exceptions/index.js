'use strict'

const GE = require('@adonisjs/generic-exceptions')

/**
 * This exception is raised when no roles passed
 *
 * @class NoRolesException
 */
class NoRolesException extends GE.LogicalException {
  static invoke () {
    return new this('No roles were passed', 500, 'E_NO_ROLES_PASSED')
  }
}

/**
 * This exception is raised when user is not authenticated
 *
 * @class UserNotAuthenticatedException
 */
class UserNotAuthenticatedException extends GE.LogicalException {
  static invoke () {
    return new this('User is not authenticated', 401, 'E_USER_NOT_AUTHENTICATED')
  }
}

/**
 * This exception is raised when user do not have permission
 *
 * @class PermissionException
 */
class PermissionException extends GE.LogicalException {
  static invoke () {
    return new this('You do not have permission to view this resource', 403, 'E_NOT_HAVE_PERMISSION')
  }
}


module.exports = {
  NoRolesException,
  UserNotAuthenticatedException,
  PermissionException
}
