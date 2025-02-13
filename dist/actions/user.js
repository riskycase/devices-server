"use server";
import { auth, signIn, signOut } from "@/auth";
import { db } from "@/db";
export async function signInAction() {
    return signIn("google");
}
export async function signOutAction() {
    return signOut();
}
export async function getUser() {
    const user = await auth();
    if (!user || !user.user) {
        return null;
    }
    return db.user.findFirstOrThrow({ where: { id: user.user.id } });
}
