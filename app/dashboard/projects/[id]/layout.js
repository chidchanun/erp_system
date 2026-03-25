import ProjectLayoutClient from "./ProjectLayoutClient";

export const metadata = {
    title: "Project Detail",
    description: "รายละเอียดโปรเจ็ค",
};


export default function Layout({ children }) {
    return (
        <ProjectLayoutClient>
            {children}
        </ProjectLayoutClient>
    )
}