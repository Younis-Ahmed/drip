import process from 'process'
import * as schema from '@/server/schema'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(process.env.POSTGRES_URL!)
export const db = drizzle(sql, { schema, logger: true })

// const result = await db.select().from(...);
