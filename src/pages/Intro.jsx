import React from 'react'

export const Intro = () => {
    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
            }}
        >
            {/* Hero overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Hero content */}
            <div className="relative flex min-h-screen items-center justify-center text-center text-white">
                <div className="max-w-md px-4">
                    <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                    <p className="mb-5">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                    </p>
                    <button className="rounded bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    )
}
