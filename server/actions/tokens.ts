"use sever"

import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens } from "../schema";

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const token = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.token, email),
        });

        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const generateEmailVerificationToken = async (email: string) => {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email); // Check if token already exists

    if (existingToken) {
        await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
    }

    const newToken = await db.insert(emailTokens).values({
        email,
        token,
        expires,
    }).returning();

    return newToken;
}