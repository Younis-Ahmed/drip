import process from 'node:process'
import * as dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

dotenv.config({
  path: '.env.local',
})

export default defineConfig({
  schema: './server/schema.ts',
  out: './server/migrations',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
  verbose: true,
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
})
