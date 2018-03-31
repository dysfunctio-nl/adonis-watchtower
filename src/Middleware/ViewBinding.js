'use strict'

class ViewBinding {
  async handle ({ auth, view }, next) {
    if (auth && auth.user && view && typeof (view.share) === 'function') {
      const user = auth.user

      let roles = []

      if (typeof user.getRoles === 'function') {
        roles = await user.getRoles()
      }

      let permissions = []

      if (typeof user.getPermissions === 'function') {
        permissions = await user.getPermissions()
      }

      view.share({
        watchtower: {
          roles,
          permissions
        }
      })
    }

    await next()
  }
}

module.exports = ViewBinding
