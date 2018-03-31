'use strict'

const Model = use('Model')

class Role extends Model {
  static get traits () {
    return [
      '@provider:WatchTower/Traits/HasPermissions',
      '@provider:WatchTower/Traits/HasUsers'
    ]
  }
}

module.exports = Role
