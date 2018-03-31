'use strict'

const Schema = use('Schema')

class RolesSchema extends Schema {
  up () {
    this.create('roles', (table) => {
      table.increments()

      table.string('slug').notNullable().unique()
      table.string('name').notNullable().unique()
      table.text('description').nullable()
      
      table.timestamps()
    })
  }

  down () {
    this.drop('roles')
  }
}

module.exports = RolesSchema
