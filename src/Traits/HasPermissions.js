'use strict'

const _ = require('lodash')
const Config = use('Config')

class HasPermissions {
  register (Model) {
    /**
    * Many-To-Many Relationship Method for accessing permissions
    *
    * @return Object
    */
    Model.prototype.permissions = function () {
      return this.belongsToMany(Config.get('watchtower.models.permission'))
    }

    Model.prototype.getPermissions = async function () {
      let permissions = await this.getDirectPermissions()

      if (typeof this.roles === 'function') {
        const roles = await this.roles().fetch()
        let rolesPermissions = []

        for (let role of roles.rows) {
          const rolePermissions = await role.getPermissions()
          rolesPermissions = rolesPermissions.concat(rolePermissions)
        }

        permissions = _.uniq(permissions.concat(rolesPermissions))
      }

      return permissions
    }

    Model.prototype.getDirectPermissions = async function () {
      const permissions = await this.permissions().fetch()
      return permissions.rows.map(({ slug }) => slug)
    }

    Model.prototype.hasAnyPermission = async function (permissions) {
      if (!Array.isArray(permissions)) throw new Error(`Permissions need to be passed in as an array`)

      return await this.hasDirectPermissionTo(permissions)
    }

    Model.prototype.hasPermissionTo = async function (permission) {
      permissions = (Array.isArray(permissions)) ? permissions : [permissions]

      const attachedPermissions = await this.getPermissions()

      return permissions.some(permission => {
        return attachedPermissions.includes(permission)
      })
    }

    Model.prototype.hasDirectPermissionTo = async function (permission) {
      permissions = (Array.isArray(permissions)) ? permissions : [permissions]

      const attachedPermissions = await this.getDirectPermissions()

      return permissions.some(permission => {
        return attachedPermissions.includes(permission)
      })
    }

    Model.prototype.givePermissionTo = async function (permissions) {
      permissions = (Array.isArray(permissions)) ? permissions : [permissions]

      permissions = permissions.map(async (permission) => {
        switch(typeof permission) {
          case 'string':
            const Permission = use(Config.get('watchtower.models.permission'))
            return (await Permission.query().where('slug', permission).first()).id

          case 'object':
            if (!permission.id) {
              throw new Error("You passed in an object that isn't a Model")
            }
            return permission.id

          case 'number':
            return permission

          default:
            throw new Error("Make sure you're passing in an id, slug or Model")
        }
      })

      permissions = await Promise.all(permissions)

      return await this.permissions().attach(permissions)
    }

    Model.prototype.syncPermissions = async function (permissions) {
      await this.permissions().detach()
      
      return this.givePermissionTo(permissions)
    }

    Model.prototype.revokePermissionTo = async function (permissions) {
      permissions = (Array.isArray(permissions)) ? permissions : [permissions]

      permissions = permissions.map(async (permission) => {
        switch(typeof permission) {
          case 'string':
            const Permission = use(Config.get('watchtower.models.permission'))
            return (await Permission.query().where('slug', permission).first()).id

          case 'object':
            if (!permission.id) {
              throw new Error("You passed in an object that isn't a Model")
            }
            return permission.id

          case 'number':
            return permission

          default:
            throw new Error("Make sure you're passing in an id, slug or Model")
        }
      })

      permissions = await Promise.all(permissions)

      return await this.permissions().detach([permissions])
    }

    Model.prototype.hasAllPermissions = async function (permissions) {
      if (!Array.isArray(permissions)) throw new Error(`Permissions need to be passed in as an array`)

      const attachedPermissions = await this.getPermissions()

      return permissions.every(permission => {
        return attachedPermissions.includes(permission)
      })
    }
  }
}

module.exports = HasPermissions