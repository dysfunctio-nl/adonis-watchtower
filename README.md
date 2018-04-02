# Adonis WatchTower

  

WatchTower is an addon for [Adonis](http://adonisjs.com/) that provides roles and permissions on top of the built in auth. It is also heavily inspired by [adonis-acl](https://github.com/enniel/adonis-acl)

## Contents
- [Main Features](#main-features)
- [Setup](#setup)
    - [Install](#install)
    - [Config](#config)
- [Usage](#usage)
    - [Working with users](#working-with-users)
    - [Working with roles](#working-with-roles)
    - [Working with permissions](#working-with-permissions)
- [Middleware](#middleware)
- [Views](#views)
    - [@Can](#can)
    - [@Is](#is)
	
## Main Features
* Roles & Permissions
* Middleware (can/is)
* View Tags (@can/@is)

## Setup
### Install

Install WatchTower
```bash
adonis install @dysfunctionl/adonis-watchtower
```

Like any other provider, you need to register the provider inside `start/app.js` file.

```js
const providers = [
  '@dysfunctionl/adonis-watchtower/providers/WatchTowerProvider'
]
```

Register the following middleware inside `start/kernel.js` file:
```js
const namedMiddleware = {
  can: 'WatchTower/Middleware/Can',
  is: 'WatchTower/Middleware/Is'
}
```

If you wish to use the view tags (@can/is), register the following:

```js
const globalMiddleware = [
  'WatchTower/Middleware/ViewBinding'
]
```

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

Publish and run the migrations using these commands:

```bash
adonis watchtower:setup
adonis migration:run
```

Start the server
```bash
adonis serve --dev
```

----------

### Config
The configuration is saved inside `config/watchtower.js` file. Tweak it accordingly.

```js
'use strict'

module.exports = {
  'models': {
    // Permission model
    'permission': 'WatchTower/Models/Permission',
    
    // Role model
    'role': 'WatchTower/Models/Role',
    
    // User model
    'user': 'App/Models/User'
  }
}
```

## Usage

### Working with users

Fetching roles/permissions
```js
// Roles associated with model
await user.roles().fetch()
// Same as above but slugs only
await user.getRoles()

// Permissions directly associated with model
await user.permissions().fetch()
// Permissions directly and indirectly associated with model as slug
await user.getPermissions()
// Permissions directly associated with model as slug
await user.getDirectPermissions()
```

Checking roles/permissions
```js
// Pass in an id, slug or model instance, either singularly or multiple in an array
await user.is('administrator')
await user.can(['update-this', 'create-that'])

await user.hasAnyRole(['administrator','moderator'])
await user.hasAllRoles(['administrator','moderator'])

await user.hasPermissionTo('update-this')
await user.hasDirectPermissionTo('create-that')

await user.hasAnyPermission(['update-this', 'create-that'])
await user.hasAllPermissions(['update-this', 'create-that'])
```

Attaching/Syncing/Removing of role/permissions

```js
// Pass in an id, slug or model instance, either singularly or multiple in an array
await user.assignRoles(['moderator', 'user'])
await user.removeRoles('moderator')
await user.syncRoles(['administrator', 'user'])

await user.givePermissionTo(['update-this', 'create-that'])
await user.revokePermissionTo(['update-this', 'create-that'])
await user.syncPermissions(['update-this', 'create-that'])
```

### Working with roles

Fetching users/permissions
```js
// Users associated with model
await role.users().fetch()
// Same as above
await role.getUsers()

// Permissions directly associated with model
await role.permissions().fetch()
// Permissions directly associated with model as slug
await role.getPermissions()
```

Checking permissions
```js
// Pass in an id, slug or model instance, either singularly or multiple in an array
await role.hasPermissionTo('update-this')

await role.hasAnyPermission(['update-this', 'create-that'])
await role.hasAllPermissions(['update-this', 'create-that'])
```

Attaching/Syncing/Removing of permissions
```js
// Pass in an id, slug or model instance, either singularly or multiple in an array
await role.givePermissionTo(['update-this', 'create-that'])
await role.revokePermissionTo(['update-this', 'create-that'])
await role.syncPermissions(['update-this', 'create-that'])
```

### Working with permissions

Fetching users/permissions
```js
// Users associated with model
await permission.users().fetch()
// Same as above
await permission.getUsers()

// Roles associated with model
await permission.roles().fetch()
// Same as above but slugs only
await permission.getRoles()
```

Checking roles
```js
// Pass in an id, slug or model instance, either singularly or multiple in an array
await permission.hasAnyRole(['administrator','moderator'])
await permission.hasAllRoles(['administrator','moderator'])
```

Attaching/Syncing/Removing of roles
```js
// Pass in an id, slug or model instance, either singularly or multiple in an array
await permission.assignRoles(['moderator', 'user'])
await permission.removeRoles('moderator')
await permission.syncRoles(['administrator', 'user'])
```

## Middleware

```js
Route.get('/posts', ()=>{})
    .middleware(['can:read-posts, create-posts'])
```

```js
Route.get('/posts', ()=>{})
    .middleware(['is:admin, user'])
```

## Views

### @Can

```js
@can('update-users')
    // Do something if user has permission
@else
    // Otherwise do this
@endcan
```

```js
@can(['create-posts', 'read-posts'])
    // Do something if user has permissions
@else
    // Otherwise do this
@endcan
```

---

### @Is

```js
@is('admin')
    // Do something if user has role
@else
    // Otherwise do this
@endis
```

```js
@is(['admin', 'moderator'])
    // Do something if user has roles
@else
    // Otherwise do this
@endis
```