'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash2, Copy, Download } from 'lucide-react'

interface VMConsoleProps {
  logs?: string[]
}

export function VMConsole({ logs = [] }: VMConsoleProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new logs are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [logs])

  const clearLogs = () => {
    // In a real implementation, this would clear the logs in the playground
    console.log('Clear logs')
  }

  const copyLogs = () => {
    const logText = logs.join('\n')
    navigator.clipboard.writeText(logText)
  }

  const downloadLogs = () => {
    const logText = logs.map((log, index) => `[${new Date().toISOString()}] ${log}`).join('\n')
    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-playground-logs-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-slate-300">EVM Console</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={copyLogs}
            className="h-7 px-2 text-xs text-slate-400 hover:text-slate-200"
          >
            <Copy className="w-3 h-3" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={downloadLogs}
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
          >
            <Download className="w-3 h-3" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={clearLogs}
            className="h-7 px-2 text-slate-400 hover:text-slate-200"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-1 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-slate-500 text-center py-8">
              <div className="mb-2">🔧 EVM Console Ready</div>
              <div>Waiting for operations...</div>
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-slate-500 text-xs flex-shrink-0">
                  {new Date().toLocaleTimeString()}
                </span>
                <span className="text-green-400 break-words">
                  {log}
                </span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}