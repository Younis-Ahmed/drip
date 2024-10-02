import { pgTable, serial, text } from "drizzle-orm/pg-core";


export const post = pgTable('post', {
    id: serial("id").primaryKey().notNull(),
    title: text("title").notNull(),
})