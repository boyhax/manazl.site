'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Menu, X, Home, Compass, Briefcase, MessageCircle, User, Settings, Gamepad } from 'lucide-react'
import { Link } from 'react-router-dom'
const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    // { icon: Compass, label: 'Explore', href: '/?' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: MessageCircle, label: 'Chat', href: '/chat' },
    { icon: User, label: 'Profile', href: '/account' },
]

const NavigationFAB: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)
    const dev = import.meta.env.MODE === 'development'
    return (
        <TooltipProvider>
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={toggleMenu}
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                >
                    <AnimatePresence initial={false} mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -180, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 180, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="h-6 w-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 180, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -180, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu className="h-6 w-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="absolute bottom-full right-0 mb-4 flex flex-col items-end gap-2"
                        >
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 50, opacity: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={toggleMenu}
                                                asChild
                                                variant="secondary"
                                                size="icon"
                                                className="h-12 w-12 rounded-full shadow-md"
                                            >
                                                <Link to={item.href}>
                                                    <item.icon className="h-5 w-5" />
                                                    <span className="sr-only">{item.label}</span>
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left" sideOffset={5}>
                                            {item.label}
                                        </TooltipContent>
                                    </Tooltip>
                                </motion.div>
                            ))}
                           {!dev?null: <motion.div
                                key={'playgroundfap'}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 50, opacity: 0 }}
                                transition={{ duration: 0.2, delay: 5 * 0.05 }}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={toggleMenu}
                                            asChild
                                            variant="secondary"
                                            size="icon"
                                            className="h-12 w-12 rounded-full shadow-md"
                                        >
                                            <Link to={'/playground'}>
                                                <Gamepad className="h-5 w-5" />
                                                <span className="sr-only">{'testing'}</span>
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left" sideOffset={5}>
                                        {'testing'}
                                    </TooltipContent>
                                </Tooltip>
                            </motion.div>}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </TooltipProvider>
    )
}

export default NavigationFAB

