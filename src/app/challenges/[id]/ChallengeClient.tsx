'use client'

import { useState, useEffect } from 'react'
import { SecurityModule } from '@/lib/types'
import { modules } from '@/lib/modules'
import { CodeEditor } from '@/components/CodeEditor'
import { InfoPanel } from '@/components/InfoPanel'
import { ActionButtons } from '@/components/ActionButtons'
import { VMConsole } from '@/components/VMConsole'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Code, Bug, Shield, Terminal } from 'lucide-react'
import { ThemeSelector } from '@/components/ThemeSelector'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default function ChallengeClient({ challengeId }: { challengeId: string }) {
    const [activeTab, setActiveTab] = useState<'vulnerable' | 'attack' | 'fixed'>('vulnerable')
    const [isRunning, setIsRunning] = useState(false)
    const [code, setCode] = useState('')
    const [logs, setLogs] = useState<string[]>([])
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Find the current module
    const selectedModule = modules.find(m => m.id === challengeId)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (selectedModule) {
            setCode(selectedModule.vulnerableCode)
        }
    }, [selectedModule])

    if (!mounted) return null

    if (!selectedModule) {
        notFound()
    }

    const handleTabChange = (tab: string) => {
        const newTab = tab as 'vulnerable' | 'attack' | 'fixed'
        setActiveTab(newTab)

        switch (newTab) {
            case 'vulnerable':
                setCode(selectedModule.vulnerableCode)
                break
            case 'attack':
                setCode(selectedModule.attackCode)
                break
            case 'fixed':
                setCode(selectedModule.fixedCode)
                break
        }
    }

    const handleCompile = () => {
        setLogs([...logs, '🔨 Compiling contract...'])
        setTimeout(() => {
            setLogs(prev => [...prev, '✅ Compilation successful!'])
        }, 1000)
    }

    const handleDeploy = () => {
        setLogs([...logs, '🚀 Deploying contract to local EVM...'])
        setTimeout(() => {
            setLogs(prev => [...prev, '✅ Contract deployed at: 0x1234...5678'])
        }, 1000)
    }

    const handleExploit = () => {
        setIsRunning(true)
        setLogs([...logs, '⚡ Running exploit...'])

        setTimeout(() => {
            if (activeTab === 'vulnerable') {
                setLogs(prev => [
                    ...prev,
                    '⚠️  Vulnerability detected!',
                    `💥 ${selectedModule.vulnerability}`,
                    '❌ Exploit successful - contract is vulnerable!'
                ])
            } else if (activeTab === 'fixed') {
                setLogs(prev => [
                    ...prev,
                    '🔒 Testing fixed contract...',
                    '✅ Exploit blocked!',
                    '🎉 Fix verified - contract is safe!'
                ])
            } else {
                setLogs(prev => [
                    ...prev,
                    '💣 Attack contract deployed',
                    '⚔️  Attacking vulnerable contract...',
                    '💰 Exploit executed successfully!'
                ])
            }
            setIsRunning(false)
        }, 2000)
    }

    const handleReset = () => {
        handleTabChange(activeTab)
        setLogs(['🔄 Contract reset to original state'])
    }

    const handleSave = () => {
        setLogs([...logs, '💾 Progress saved!'])
    }

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Background noise/gradient for IDE */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/30 blur-[100px] rounded-full" />
            </div>

            {/* Header */}
            <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/challenges">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-white/10" />
                    <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        {selectedModule.title}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        EVM Connected
                    </div>
                    <ThemeSelector />
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-12 overflow-hidden">
                {/* Left Panel - Info */}
                <div className="col-span-12 md:col-span-3 border-r border-white/5 bg-card/30 backdrop-blur-sm overflow-y-auto custom-scrollbar">
                    <InfoPanel module={selectedModule} />
                </div>

                {/* Middle Panel - Code Editor */}
                <div className="col-span-12 md:col-span-6 flex flex-col min-h-[500px] bg-background/50">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
                        <div className="border-b border-white/5 bg-black/20 px-4">
                            <TabsList className="bg-transparent w-full justify-start h-12 gap-2">
                                <TabsTrigger value="vulnerable" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20">
                                    <Bug className="w-4 h-4 mr-2" />
                                    Vulnerable
                                </TabsTrigger>
                                <TabsTrigger value="attack" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 border border-transparent data-[state=active]:border-red-500/20">
                                    <Code className="w-4 h-4 mr-2" />
                                    Exploit
                                </TabsTrigger>
                                <TabsTrigger value="fixed" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 border border-transparent data-[state=active]:border-green-500/20">
                                    <Shield className="w-4 h-4 mr-2" />
                                    Patched
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 relative">
                            <div className="absolute inset-0">
                                <CodeEditor
                                    code={code}
                                    language="solidity"
                                    isDarkMode={true}
                                    readOnly={activeTab === 'attack'}
                                    onChange={setCode}
                                />
                            </div>
                        </div>
                    </Tabs>

                    {/* Action Buttons */}
                    <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
                        <ActionButtons
                            selectedModule={selectedModule}
                            activeTab={activeTab}
                            isDarkMode={true}
                            onToggleDarkMode={() => { }}
                            onCompile={handleCompile}
                            onDeploy={handleDeploy}
                            onExploit={handleExploit}
                            onReset={handleReset}
                            onSave={handleSave}
                            isRunning={isRunning}
                        />
                    </div>
                </div>

                {/* Right Panel - Console */}
                <div className="col-span-12 md:col-span-3 border-l border-white/5 bg-black/40 flex flex-col">
                    <div className="p-3 border-b border-white/5 font-mono text-xs font-bold flex items-center gap-2 text-muted-foreground bg-black/20">
                        <Terminal className="w-3 h-3" />
                        TERMINAL_OUTPUT
                    </div>
                    <div className="flex-1 overflow-hidden p-2">
                        <VMConsole logs={logs} isRunning={isRunning} />
                    </div>
                </div>
            </div>
        </div>
    )
}
