/*
|--------------------------------------------------------------------------
| HTTP server entrypoint
|--------------------------------------------------------------------------
|
| The "server.ts" file is the entrypoint for starting the AdonisJS HTTP
| server. Either you can run this file directly or use the "serve"
| command to run this file and monitor file changes
|
*/

import { Ignitor, prettyPrintError } from '@adonisjs/core'
import { Database } from '@adonisjs/lucid/database'
import { MigrationRunner } from '@adonisjs/lucid/migration'
import 'reflect-metadata'

/**
 * URL to the application root. AdonisJS need it to resolve
 * paths to file and directories for scaffolding commands
 */
const APP_ROOT = new URL('../', import.meta.url)

/**
 * The importer is used to import files in context of the
 * application.
 */
const IMPORTER = (filePath: string) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.booting(async () => {
      await import('#start/env')
    })
    app.booted(async () => {
      const db = await app.container.make(Database)

      const migrator = new MigrationRunner(db, app, {
        direction: 'up',
        dryRun: false,
      })
      const migrations = await migrator.getList()
      console.log('migrations: ', migrations)
      console.log('migrated files:', migrator.migratedFiles)
      await migrator.run()
    })
    app.listen('SIGTERM', () => app.terminate())
    app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
  })
  .httpServer()
  .start()
  .catch((error) => {
    process.exitCode = 1
    prettyPrintError(error)
  })
