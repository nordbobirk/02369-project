"use client"; // only needed if you'll use hooks like useState

import { useState } from "react";
import {CheckCircle} from "lucide-react";
// import { BookingFormData } from "@/app/(public)/booking/_components/Form"; // uncomment when you actually use it

export default function Confirm() {
    return (
        <>
            <h1 className="mb-6 flex items-center justify-center gap-3 text-2xl font-bold text-white">
                <CheckCircle className="size-40 text-green-500" />
            </h1>

            <h2 className="mb-6 flex items-center justify-center gap-3 text-2xl font-bold text-black">
                <span>Din booking er hermed indsendt </span>
            </h2>
        </>
    );
}
