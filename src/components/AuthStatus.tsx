"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthStatus() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "authenticated") {
        return (
            <div className="flex items-center gap-4">
                <span>Signed in as {session.user?.name}</span>
                <button
                    onClick={() => signOut()}
                    className="rounded-full bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => signIn("tesla")}
            className="rounded-full bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
            Sign in
        </button>
    );
}