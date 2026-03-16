export const metadata = {
    title: "Create Project",
    description: "สร้างโปรเจ็ค และเพิ่มสมาชิกที่ร่วมพัฒนา",
};


export default function Layout({ children }) {
    return (
        <div className="flex-1 overflow-y-auto p-3
                text-gray-800 dark:text-gray-100
                transition-colors duration-300
                custom-scrollbar w-full flex flex-col items-center">
            {children}
        </div>
    )
}