export const metadata = {
    title: "ระบบฝ่ายทรัพยากรบุคคล",
    description: "ระบบที่จัดการเกี่ยวกับพนักงานในบริษัท โดยฝ่ายทรัพยากรบุคคล",
};


export default function Layout({ children }) {
    return (
        <div className="flex-1 overflow-y-auto p-3
                text-gray-800 dark:text-gray-100
                transition-colors duration-300
                custom-scrollbar w-full flex flex-col">
            {children}
        </div>
    )
}