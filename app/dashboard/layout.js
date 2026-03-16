
import DashboardLayoutClient from "./DashboardLayoutClient"

export const metadata = {
    title: "Dashboard | MyApp",
}

export default function Layout({ children }) {
    return (
        <DashboardLayoutClient>
            {children}
        </DashboardLayoutClient>
    )
}