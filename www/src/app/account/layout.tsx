'use client'

import { Calendar, Home, Menu, User, MessageCircle } from "lucide-react"
import { Suspense, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import Page, { MainContent } from "src/components/Page"
import { useTranslate } from "@tolgee/react"
import { usePathname, useRouter } from "next/navigation"
import LoadingSpinnerComponent from "react-spinners-components"



export default function AccountLayout({ children }) {
    const { t } = { t: (te: string) => te }
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    const menuItems = [
        { icon: Home, label: t("Overview"), value: "/account" },
        { icon: Calendar, label: t("Reservations"), value: "/account/reservations" },
        { icon: User, label: t("My Host"), value: "/account/myhost" },
        { icon: MessageCircle, label: t("Chats"), value: "/account/chat" },
    ]
    return (

        <div className="w-full h-full">
            <div className="min-h-screen  bg-gray-100 dark:bg-gray-900">
                <div className="container mx-auto p-4 space-y-6">
                    {/* Mobile Menu Button */}
                    <Button variant="outline" className="md:hidden mb-4" onClick={() => setIsMenuOpen(true)}>
                        <Menu className="h-4 w-4 mr-2" />
                        {"Menu"}
                    </Button>

                    <div className="flex flex-col md:flex-row gap-4 h-full">
                        {/* Sidebar for larger screens */}
                        <aside className="hidden md:block w-64 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Menu</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <nav className="space-y-2">
                                        {menuItems.map((item) => (
                                            <Button
                                                key={item.value}
                                                variant={pathname == item.value ? 'default' : 'ghost'}
                                                className="w-full justify-start"
                                                onClick={() => router.push(item.value)}
                                            >
                                                <item.icon className="h-4 w-4 mr-2" />
                                                {item.label}
                                            </Button>
                                        ))}
                                    </nav>
                                </CardContent>
                            </Card>
                        </aside>

                        {/* Mobile Menu */}
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Menu</SheetTitle>
                                    <SheetDescription>{t("Navigate your account")}</SheetDescription>
                                </SheetHeader>
                                <nav className="space-y-2 mt-4">
                                    {menuItems.map((item) => (
                                        <Button
                                            key={item.value}
                                            variant={pathname == item.value ? 'default' : 'ghost'}
                                            className="w-full justify-start"
                                            onClick={() => router.push(item.value)
                                            }
                                        >
                                            <item.icon className="h-4 w-4 mr-2" />
                                            {item.label}
                                        </Button>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>

                        {/* Main Content */}
                        <main className=" max-h-[90vh]  overflow-auto w-full ">
                            <Suspense fallback={<LoadingSpinnerComponent />}>
                                {children}
                            </Suspense>
                        </main>
                    </div>
                </div>
            </div>
        </div>


    )
}