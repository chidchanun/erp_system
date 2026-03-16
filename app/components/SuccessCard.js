'use client'

export default function SuccessCard({ message = "Success", onClose }) {

    return (

        <div className="fixed inset-0 flex items-center justify-center z-50">

            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* card */}
            <div
                className="
                relative
                bg-white dark:bg-gray-800
                text-gray-800 dark:text-gray-100
                p-8
                rounded-2xl
                shadow-xl
                w-100
                text-center
                animate-[scaleIn_.35s_ease]
                mx-2
                "
            >

                <div className="flex justify-center mb-4">

                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center animate-bounce">

                        <svg
                            className="w-8 h-8 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>

                    </div>

                </div>

                <h2 className="text-xl font-bold mb-2">
                    Successful
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition cursor-pointer"
                >
                    ตกลง
                </button>

            </div>

        </div>
    )
}