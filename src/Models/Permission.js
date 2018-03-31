'use strict'

const Model = use('Model')

class Permission extends Model {
  static get traits () {
    return [
      '@provider:WatchTower/Traits/HasRoles',
      '@provider:WatchTower/Traits/HasUsers'
    ]
  }
}

module.exports = Permission
