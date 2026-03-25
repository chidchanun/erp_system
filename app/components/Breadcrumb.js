import Link from "next/link"

export default function Breadcrumb({ items }) {

    return (
        <div className="flex items-center text-sm text-gray-500 gap-1  max-md:text-xs flex-wrap">

            {items.map((item, index) => (

                <div key={index} className="flex items-center gap-1">

                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-blue-600"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {item.label}
                        </span>
                    )}

                    {index < items.length - 1 && <span>/</span>}

                </div>

            ))}

        </div>
    )
}