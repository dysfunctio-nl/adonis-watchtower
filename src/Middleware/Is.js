'use strict'

const CE = require('../Exceptions')

class Is {
  async handle ({ auth }, next, roles) {
    if (roles == null) {
      throw CE.NoRolesException.invoke()
    }

    if (!auth || !auth.user) {
      CE.UserNotAuthenticatedException.invoke()
    }

    if (!await auth.user.is(roles)) {
      throw CE.PermissionException.invoke()
    }

    await next()
  }
}

module.exports = Is
