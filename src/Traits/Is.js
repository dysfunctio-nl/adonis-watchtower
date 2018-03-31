'use strict'

const _ = require('lodash')

class Is {
  register(Model) {
    Model.prototype.is = async function (expression) {
      const roles = await this.getRoles()

      expression = (Array.isArray(expression)) ? expression : [expression]

      return roles.some((role) => {
        return expression.includes(role)
      })
    }
  }
}

module.exports = Is