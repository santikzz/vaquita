// import { Header } from "@/components/web/header"
// import { Footer } from "@/components/web/footer"
import { cn } from "@/lib/utils"
import { Head } from "@inertiajs/react"

interface Props {
    children: React.ReactNode
    className?: string
    title?: string
    [key: string]: any
}

export default function WebLayout({
    children,
    className,
    title = "",
    ...props
}: Props) {
    return (
        <div className="flex min-h-screen flex-col">
            <Head title={title} />
            {/* <Header /> */}
            <main className={cn("flex-1", className)} {...props}>
                {children}
            </main>
            {/* <Footer /> */}
        </div>
    )
}
