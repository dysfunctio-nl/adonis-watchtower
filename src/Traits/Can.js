'use strict'

const _ = require('lodash')

class Can {
  register(Model) {
    Model.prototype.can = async function (expression) {
      const permissions = await this.getPermissions()

      expression = (Array.isArray(expression)) ? expression : [expression]

      return permissions.some((permission) => {
        return expression.includes(permission)
      })
    }
  }
}

module.exports = Can