'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Zap, Lock, Cpu, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DVDChallenge } from '@/lib/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ChallengeCardProps {
    challenge: DVDChallenge
    index: number
}

const CATEGORY_ICONS = {
    'DeFi': Shield,
    'Governance': Lock,
    'Lending': Cpu,
    'Flash Loans': Zap,
    'Oracles': Zap // Assuming Oracles also uses Zap or similar
}

export function ChallengeCard({ challenge, index }: ChallengeCardProps) {
    const Icon = CATEGORY_ICONS[challenge.category] || Shield

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative glass p-6 rounded-[32px] border-border hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                        "p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform",
                        challenge.difficulty === 'advanced' && "bg-red-500/10 text-red-500"
                    )}>
                        <Icon size={24} />
                    </div>
                    <Badge variant="outline" className={cn(
                        "capitalize border-border",
                        challenge.difficulty === 'intermediate' ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" : "text-red-500 border-red-500/20 bg-red-500/5"
                    )}>
                        {challenge.difficulty}
                    </Badge>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {challenge.subtitle}
                    </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        {challenge.category}
                    </span>
                    <Link href={`/dvd/${challenge.id}`}>
                        <Button variant="ghost" size="sm" className="rounded-full gap-2 hover:bg-primary hover:text-white group/btn">
                            Hack Now
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
