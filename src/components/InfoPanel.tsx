'use client'

import { SecurityModule } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Shield, Zap, BookOpen, ExternalLink, Target, Info } from 'lucide-react'

interface InfoPanelProps {
  module: SecurityModule
}

export function InfoPanel({ module }: InfoPanelProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">
            {module.title}
          </h3>
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {module.description}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Difficulty:</span>
          <Badge className={
            module.difficulty === 'beginner' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : module.difficulty === 'intermediate'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }>
            {module.difficulty}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="vulnerability" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="vulnerability" className="text-xs p-2">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Bug
          </TabsTrigger>
          <TabsTrigger value="impact" className="text-xs p-2">
            <Zap className="w-3 h-3 mr-1" />
            Impact
          </TabsTrigger>
          <TabsTrigger value="prevention" className="text-xs p-2">
            <Shield className="w-3 h-3 mr-1" />
            Fix
          </TabsTrigger>
          <TabsTrigger value="references" className="text-xs p-2">
            <BookOpen className="w-3 h-3 mr-1" />
            Learn
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vulnerability" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Vulnerability
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {module.vulnerability}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Explanation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {module.explanation}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-500" />
                Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {module.impact}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prevention" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Prevention
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {module.prevention}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="references" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                References
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {module.references.map((reference, index) => (
                <a
                  key={index}
                  href={reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  {reference.split('/').pop()?.replace(/[-_]/g, ' ') || reference}
                </a>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Learning Path
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
              1
            </div>
            <span className="text-slate-600 dark:text-slate-400">
              Study the vulnerable code
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
              2
            </div>
            <span className="text-slate-600 dark:text-slate-400">
              Run the exploit contract
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
              3
            </div>
            <span className="text-slate-600 dark:text-slate-400">
              Try to fix the vulnerability
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
              4
            </div>
            <span className="text-slate-600 dark:text-slate-400">
              Test your fix against the exploit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}