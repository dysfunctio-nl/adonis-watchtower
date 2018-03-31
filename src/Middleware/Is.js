'use strict'

class Is {
  async handle ({ auth }, next, roles) {
    if (roles == null) {
      throw new Error('No roles were passed.')
    }
    
    if (!auth || !auth.user) {
      throw new Error('Access denied. You need to be authenticated to view this resource.')
    }

    if (!auth.user.is(roles)) {
      throw new Error('Access denied. You do not have permission to view this resource.')
    }

    await next()
  }
}

module.exports = Is
