"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-md dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-6 flex flex-col items-center">
                    <Image
                        src="/tesla-logo.png" // You'll need to add this logo to your public folder
                        alt="Tesla Logo"
                        width={100}
                        height={100}
                        className="mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Sign in to Tesla Lease Tracker
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Track and manage your Tesla lease information
                    </p>
                </div>

                <button
                    onClick={() => signIn("tesla", { callbackUrl: "/" })}
                    className="flex w-full items-center justify-center rounded-md bg-black py-3 text-white hover:bg-gray-800"
                >
                    <span>Sign in with Tesla</span>
                </button>
            </div>
        </div>
    );
}