## Registering provider

Like any other provider, you need to register the provider inside `start/app.js` file.

```js
const providers = [
  '@dysfunctionl/adonis-watchtower/providers/WatchTowerProvider'
]
```

## Registering middleware

Register the following middleware inside `start/kernel.js` file.

```js
const namedMiddleware = {
  can: 'WatchTower/Middleware/Can',
  is: 'WatchTower/Middleware/Is'
}
```

If you wish to use the view helpers, register the following:

```js
const globalMiddleware = [
  'WatchTower/Middleware/ViewBinding'
]
```

## Setup

Add traits to the `app/Models/User.js` model:

```js
class User extends Model {
  static get traits () {
    return [
      '@provider:WatchTower/Traits/HasRoles',
      '@provider:WatchTower/Traits/HasPermissions',
      '@provider:WatchTower/Traits/Can',
      '@provider:WatchTower/Traits/Is',
    ]
  }
}
```

To publish and run the migrations using these commands:

```bash
adonis watchtower:setup
adonis migration:run
```

## Config

The configuration is saved inside `config/watchtower.js` file. Tweak it accordingly.

## Docs

To find out more, read the docs [here](https://github.com/dysfunctio-nl/adonis-watchtower).