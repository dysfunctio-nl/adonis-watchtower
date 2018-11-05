'use strict'

const CE = require('../Exceptions')

class Can {
  async handle ({ auth }, next, permissions) {
    if (permissions == null) {
      throw CE.NoRolesException.invoke()
    }

    if (!auth || !auth.user) {
      CE.UserNotAuthenticatedException.invoke()
    }

    if (!await auth.user.can(permissions)) {
      throw CE.PermissionException.invoke()
    }

    await next()
  }
}

module.exports = Can
