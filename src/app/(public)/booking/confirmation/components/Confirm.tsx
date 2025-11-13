"use client";
import { CheckCircle } from "lucide-react";

export default function Confirm() {
    return (
        <section className="-mx-[calc(50vw-50%)] w-screen">
            <div className="mx-auto max-w-6xl px-6 py-16">
                {/* Balanced two-column layout, vertically centered */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center min-h-[60vh]">
                    {/* Left: big headline + icon */}
                    <div className="md:col-span-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black">
                            Din booking er indsendt
                        </h1>
                        <div className="mt-8">
                            <CheckCircle className="h-32 w-32 md:h-40 md:w-40 text-green-500" />
                        </div>
                    </div>

                    {/* Right: compact card with copy + clear links */}
                    <div className="md:col-span-6">
                        <div className="rounded-2xl border border-black/10 bg-white shadow-sm p-6 md:p-7">
                            <p className="text-base md:text-lg leading-relaxed text-slate-800">
                                Tak for din forespørgsel – vi vender tilbage hurtigst muligt.
                            </p>

                            <div className="mt-5 space-y-3">
                                <a
                                    href="/beforeBooking"
                                    className="inline-flex items-center justify-between w-full rounded-xl border border-black/10 px-4 py-3 text-left hover:bg-slate-50 transition"
                                >
                                    <span className="font-medium">Før din booking</span>
                                    <span className="text-green-600">Læs mere →</span>
                                </a>

                                <a
                                    href="/aftercare"
                                    className="inline-flex items-center justify-between w-full rounded-xl border border-black/10 px-4 py-3 text-left hover:bg-slate-50 transition"
                                >
                                    <span className="font-medium">Efter behandlingen</span>
                                    <span className="text-green-600">Læs mere →</span>
                                </a>

                                <a
                                    href="/faq"
                                    className="inline-flex items-center justify-between w-full rounded-xl border border-black/10 px-4 py-3 text-left hover:bg-slate-50 transition"
                                >
                                    <span className="font-medium">FAQ</span>
                                    <span className="text-green-600">Se spørgsmål →</span>
                                </a>
                            </div>

                            {/* small reassurance line */}
                            <p className="mt-6 text-sm text-slate-500">
                                Du får en bekræftelse på mail, når vi har gennemgået din anmodning.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
