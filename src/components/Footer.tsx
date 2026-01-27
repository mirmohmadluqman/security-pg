'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'

interface FooterProps {
    showGitHubLogo?: boolean
}

export function Footer({ showGitHubLogo = true }: FooterProps) {
    const handleReportIssue = () => {
        const confirmed = window.confirm('Do you want to report an issue on GitHub?')
        if (confirmed) {
            window.open('https://github.com/mirmohmadluqman/security-pg/issues', '_blank')
        }
    }

    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-6">
                        {showGitHubLogo && (
                            <Link
                                href="https://github.com/mirmohmmadluqman/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-white transition-colors"
                            >
                                <Github className="w-6 h-6" />
                            </Link>
                        )}
                        <button
                            onClick={handleReportIssue}
                            className="text-sm text-muted-foreground hover:text-white transition-colors underline-offset-4 hover:underline"
                        >
                            Report Issues
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © 2026 Mir Mohmmad Luqman. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
