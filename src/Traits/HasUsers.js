'use strict'

const _ = require('lodash')
const Config = use('Config')

class HasUsers {
  register (Model) {
    /**
    * Many-To-Many Relationship Method for accessing the permissions
    *
    * @return Object
    */
    Model.prototype.users = function () {
      return this.belongsToMany(Config.get('watchtower.models.user'))
    }

    Model.prototype.getUsers = async function () {
      return await this.users().fetch()
    }
  }
}

module.exports = HasUsers