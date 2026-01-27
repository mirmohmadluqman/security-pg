'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertCircle, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function LegalGate() {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
        const hasAccepted = localStorage.getItem('security_playground_accepted')
        const isLegalPage = pathname === '/privacy' || pathname === '/terms'

        if (!hasAccepted && !isLegalPage) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }, [pathname])

    const handleAccept = () => {
        localStorage.setItem('security_playground_accepted', 'true')
        setIsOpen(false)
    }

    const handleExit = () => {
        window.location.href = 'https://google.com'
    }

    if (!mounted || !isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-xl glass border-white/10 overflow-hidden rounded-[32px] shadow-2xl relative"
                    >
                        {/* Header / Accent */}
                        <div className="h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                        <div className="p-8 md:p-10 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                    <Shield size={32} className="animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">Access Authorization</h2>
                                    <p className="text-sm text-muted-foreground font-mono uppercase tracking-widest">Acknowledgment & Terms</p>
                                </div>
                            </div>

                            <div className="space-y-4 text-slate-300">
                                <div className="glass-card bg-white/5 border-white/10 p-4 rounded-2xl flex gap-3 items-start">
                                    <AlertCircle size={20} className="text-yellow-500 shrink-0 mt-0.5" />
                                    <p className="text-sm leading-relaxed">
                                        This platform is an <span className="text-white font-bold">educational simulation</span>. All exploits and vulnerabilities are executed within a highly controlled, <span className="text-white font-bold">sandboxed environment</span> and do not impact any real-world blockchain networks.
                                    </p>
                                </div>

                                <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                                    <p>By proceeding, you acknowledge and agree to the following:</p>
                                    <ul className="space-y-2 ml-2">
                                        <li className="flex gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
                                            <span>This environment is for learning purposes only. Use of these techniques on external contracts without permission is strictly prohibited.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
                                            <span>The application uses browser <code className="text-xs bg-white/5 px-1 py-0.5 rounded text-primary">localStorage</code> to track your progress and this acknowledgment. No backend data is collected.</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
                                            <span>You are responsible for your own actions and must adhere to all local cyber-security and ethical hacking regulations.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-6 flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row gap-3">
                                    <Button
                                        variant="default"
                                        size="lg"
                                        className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-lg"
                                        onClick={handleAccept}
                                    >
                                        I Agree & Continue
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="flex-1 rounded-full border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 font-bold h-14 text-lg transition-all"
                                        onClick={handleExit}
                                    >
                                        Exit
                                    </Button>
                                </div>
                                <p className="text-[10px] text-center text-muted-foreground/60 leading-tight">
                                    By clicking “I Agree & Continue”, you accept our <Link href="/privacy" className="underline cursor-pointer hover:text-white transition-colors">Privacy Policy</Link> and <Link href="/terms" className="underline cursor-pointer hover:text-white transition-colors">Terms of Use</Link>.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
