'use strict'

class Can {
  async handle ({ auth }, next, permissions) {
    if (permissions == null) {
      throw new Error('No permissions were passed.')
    }

    if (!auth || !auth.user) {
      throw new Error('Access denied. You need to be authenticated to view this resource.')
    }

    if (!await auth.user.can(permissions)) {
      throw new Error('Access denied. You do not have permission to view this resource.')
    }

    await next()
  }
}

module.exports = Can