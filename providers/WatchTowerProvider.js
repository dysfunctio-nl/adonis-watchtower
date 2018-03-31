'use strict'

const { ServiceProvider } = use('@adonisjs/fold')

class WatchTowerProvider extends ServiceProvider {
  _registerAlias () {
    this.app.bind('WatchTower/Commands/Setup', () => require('../commands/SetupMigrations'))

    this.app.bind('WatchTower/Traits/HasRoles', () => new (require('../src/Traits/HasRoles'))())
    this.app.bind('WatchTower/Traits/HasPermissions', () => new (require('../src/Traits/HasPermissions'))())
    this.app.bind('WatchTower/Traits/HasUsers', () => new (require('../src/Traits/HasUsers'))())
    this.app.bind('WatchTower/Traits/Can', () => new (require('../src/Traits/Can'))())
    this.app.bind('WatchTower/Traits/Is', () => new (require('../src/Traits/Is'))())
    
    this.app.bind('WatchTower/Middleware/Can', () => new (require('../src/Middleware/Can'))())
    this.app.bind('WatchTower/Middleware/Is', () => new (require('../src/Middleware/Is'))())
    this.app.bind('WatchTower/Middleware/ViewBinding', () => new (require('../src/Middleware/ViewBinding'))())
    
    this.app.bind('WatchTower/Models/Permission', () => {
      const permission = require('../src/Models/Permission')
      permission._bootIfNotBooted()

      return permission
    })

    this.app.bind('WatchTower/Models/Role', () => {
      const role = require('../src/Models/Role')
      role._bootIfNotBooted()

      return role
    })
  }

  _registerTag() {
    const View = this.app.use('Adonis/Src/View')
    View.tag(new (require('../src/ViewBindings/Is'))())
    View.tag(new (require('../src/ViewBindings/Can'))())
  }

  boot () {
    this._registerAlias()
    this._registerTag()

    const ace = require('@adonisjs/ace')
    ace.addCommand('WatchTower/Commands/Setup')
  }
}

module.exports = WatchTowerProvider