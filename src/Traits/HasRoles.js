'use strict'

const _ = require('lodash')
const Config = use('Config')

class HasRoles {
  register (Model) {
    /**
    * Many-To-Many Relationship Method for accessing roles
    *
    * @return Object
    */
    Model.prototype.roles = function () {
      return this.belongsToMany(Config.get('watchtower.models.role'))
    }
    
    /**
    * Array of roles listed as slugs
    *
    * @return Array
    */
    Model.prototype.getRoles = async function () {
      let roles = await this.roles().fetch()
      roles = roles.rows.map(({ slug }) => slug)

      if (typeof this.permissions === 'function') {
        const permissions = await this.permissions().fetch()
        let permissionRoles = []

        for (let role of permissions.rows) {
          const permsionRoles = await role.getRoles()
          permissionRoles = permsionRoles.concat(permsionRoles)
        }

        roles = _.uniq(roles.concat(permissionRoles))
      }
      
      return roles
    }

    /**
    * Assigns roles by passing in an id, slug or model, singularly or in an array
    *
    * @return Array
    */
    Model.prototype.assignRoles = async function (roles) {
      roles = (Array.isArray(roles)) ? roles : [roles]

      roles = roles.map(async (role) => {
        switch(typeof role) {
          case 'string':
            const Role = use(Config.get('watchtower.models.role'))
            return (await Role.query().where('slug', role).first()).id

          case 'object':
            if (!role.id) {
              throw new Error("You passed in an object that isn't a Model")
            }
            return role.id

          case 'number':
            return role

          default:
            throw new Error("Make sure you're passing in an id, slug or Model")
        }
      })

      roles = await Promise.all(roles)

      return await this.roles().attach(roles)
    }

    /**
    * Removes roles by passing in an id, slug or model, singularly or in an array
    *
    * @return Array
    */
    Model.prototype.removeRoles = async function (roles) {
      roles = (Array.isArray(roles)) ? roles : [roles]

      roles = roles.map(async (role) => {
        switch(typeof role) {
          case 'string':
            const Role = use(Config.get('watchtower.models.role'))
            return (await Role.query().where('slug', role).first()).id

          case 'object':
            if (!role.id) {
              throw new Error("You passed in an object that isn't a Model")
            }
            return role.id

          case 'number':
            return role

          default:
            throw new Error("Make sure you're passing in an id, slug or Model")
        }

        if (typeof role === 'string') {
          const Role = use(Config.get('watchtower.models.role'))

          return (await Role.query().where('slug', role).first()).id
        }
        else if (typeof role === 'object' && role.id) {
          return role.id
        }
      })

      roles = await Promise.all(roles)

      return await this.roles().detach([roles])
    }

    /**
    * Syncs roles by passing in an id, slug or model, singularly or in an array
    *
    * @return Array
    */
    Model.prototype.syncRoles = async function (roles) {
      await this.roles().detach()
      
      return this.assignRoles(roles)
    }

    /**
    * Checks to see if the associated model has any of the given roles
    *
    * @return Array
    */
    Model.prototype.hasAnyRole = async function (roles) {
      if (!Array.isArray(roles)) throw new Error(`Roles need to be passed in as an array`)

      const attachedRoles = await this.getRoles()

      return roles.some(role => {
        return attachedRoles.includes(role)
      })
    }

    /**
    * Checks to see if the associated model has all of the given roles
    *
    * @return Array
    */
    Model.prototype.hasAllRoles = async function (roles) {
      if (!Array.isArray(roles)) throw new Error(`Roles need to be passed in as an array`)

      const attachedRoles = await this.getRoles()

      return roles.every(role => {
        return attachedRoles.includes(role)
      })
    }
  }
}

module.exports = HasRoles