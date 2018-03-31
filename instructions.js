'use strict'

/**
 * adonis-graphql
 *
 * @license MIT
 * @copyright Slynova - Romain Lanz <romain.lanz@slynova.ch>
 */

const path = require('path')

module.exports = async function (cli) {
  await cli.makeConfig('watchtower.js', path.join(__dirname, './config/watchtower.js'))
    .catch((e) => {})
    
  cli.command.completed('create', 'config/watchtower.js')
}