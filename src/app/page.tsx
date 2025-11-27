'use client'

import { useState } from 'react'
import { SecurityModule } from '@/lib/types'
import { modules } from '@/lib/modules'
import { ModuleSelector } from '@/components/ModuleSelector'
import { CodeEditor } from '@/components/CodeEditor'
import { InfoPanel } from '@/components/InfoPanel'
import { ActionButtons } from '@/components/ActionButtons'
import { VMConsole } from '@/components/VMConsole'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Code, Bug, Shield } from 'lucide-react'

export default function SecurityPlayground() {
  const [selectedModule, setSelectedModule] = useState<SecurityModule | null>(null)
  const [activeTab, setActiveTab] = useState<'vulnerable' | 'attack' | 'fixed'>('vulnerable')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [code, setCode] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  // Initialize code when module is selected
  const handleSelectModule = (module: SecurityModule) => {
    setSelectedModule(module)
    setActiveTab('vulnerable')
    setCode(module.vulnerableCode)
    setLogs([])
  }

  // Go back to module selection
  const handleBackToModules = () => {
    setSelectedModule(null)
    setLogs([])
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    const newTab = tab as 'vulnerable' | 'attack' | 'fixed'
    setActiveTab(newTab)

    if (selectedModule) {
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
  }

  // Action handlers
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
          `💥 ${selectedModule?.vulnerability}`,
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
    if (selectedModule) {
      handleTabChange(activeTab)
      setLogs(['🔄 Contract reset to original state'])
    }
  }

  const handleSave = () => {
    setLogs([...logs, '💾 Progress saved!'])
  }

  // If no module is selected, show module selection
  if (!selectedModule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-orange-600 mb-4">
              🛡️ Security Playground
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Learn smart contract security by exploiting real vulnerabilities
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Code className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-semibold">Learn by Doing</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Run real exploits against vulnerable contracts
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Bug className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold">Interactive Lessons</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Hands-on security challenges
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold">Master Security</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Fix vulnerabilities and verify solutions
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
              Choose a Security Module
            </h2>
            <ModuleSelector modules={modules} onSelectModule={handleSelectModule} />
          </div>
        </div>
      </div>
    )
  }

  // Module detail view with code editor and learning interface
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToModules}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Modules
            </Button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              {selectedModule.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 h-[calc(100vh-73px)]">
        {/* Left Panel - Info */}
        <div className="col-span-3 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-y-auto">
          <InfoPanel module={selectedModule} />
        </div>

        {/* Middle Panel - Code Editor */}
        <div className="col-span-6 flex flex-col bg-slate-50 dark:bg-slate-900">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
            <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4">
              <TabsList className="bg-transparent">
                <TabsTrigger value="vulnerable" className="gap-2">
                  <Bug className="w-4 h-4" />
                  Vulnerable Code
                </TabsTrigger>
                <TabsTrigger value="attack" className="gap-2">
                  <Code className="w-4 h-4" />
                  Attack Contract
                </TabsTrigger>
                <TabsTrigger value="fixed" className="gap-2">
                  <Shield className="w-4 h-4" />
                  Fixed Code
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="vulnerable" className="h-full m-0">
                <CodeEditor
                  code={code}
                  language="solidity"
                  isDarkMode={isDarkMode}
                  readOnly={false}
                  onChange={setCode}
                />
              </TabsContent>
              <TabsContent value="attack" className="h-full m-0">
                <CodeEditor
                  code={code}
                  language="solidity"
                  isDarkMode={isDarkMode}
                  readOnly={true}
                />
              </TabsContent>
              <TabsContent value="fixed" className="h-full m-0">
                <CodeEditor
                  code={code}
                  language="solidity"
                  isDarkMode={isDarkMode}
                  readOnly={false}
                  onChange={setCode}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* Action Buttons */}
          <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <ActionButtons
              selectedModule={selectedModule}
              activeTab={activeTab}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
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
        <div className="col-span-3 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <VMConsole logs={logs} isRunning={isRunning} />
        </div>
      </div>
    </div>
  )
}