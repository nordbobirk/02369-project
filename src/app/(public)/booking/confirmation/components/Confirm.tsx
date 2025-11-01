"use client";
import { CheckCircle } from "lucide-react";

export default function Confirm() {
    return (
        <section className="-mx-[calc(50vw-50%)] w-screen min-h-svh border-2 border-black p-8">
            <div className="pointer-events-none fixed inset-0 z-50 border-2 border-black" />
                <h1 className="mb-6 flex items-center justify-center gap-3 text-2xl font-bold text-white">
                    <CheckCircle className="h-40 w-40 text-green-500" />
                </h1>

            <h2 className="mb-6 flex items- justify-center gap-3 text-2xl font-bold text-black">
                <span>Din booking er hermed indsendt</span>
            </h2>
        </section>
    );
}

