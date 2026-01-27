'use client'

import { SecurityModule } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Lock, AlertTriangle, Zap, Database, Key, Calculator, Phone, Clock, HardDrive, TrendingUp } from 'lucide-react'

interface ModuleSelectorProps {
  modules: SecurityModule[]
  onSelectModule: (module: SecurityModule) => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Financial Security': <Database className="w-5 h-5" />,
  'Access Control': <Lock className="w-5 h-5" />,
  'Arithmetic Security': <Calculator className="w-5 h-5" />,
  'External Interaction': <Phone className="w-5 h-5" />,
  'Authentication': <Key className="w-5 h-5" />,
  'Availability': <Clock className="w-5 h-5" />,
  'Storage Security': <HardDrive className="w-5 h-5" />,
  'MEV Security': <TrendingUp className="w-5 h-5" />
}

const difficultyColors: Record<string, string> = {
  'beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

export function ModuleSelector({ modules, onSelectModule }: ModuleSelectorProps) {
  const categories = Array.from(new Set(modules.map(m => m.category)))

  return (
    <div className="space-y-8">
      {categories.map(category => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-4">
            {categoryIcons[category]}
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {category}
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules
              .filter(module => module.category === category)
              .map(module => (
                <Card 
                  key={module.id} 
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-600"
                  onClick={() => onSelectModule(module)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-orange-500" />
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                      </div>
                      <Badge className={difficultyColors[module.difficulty]}>
                        {module.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{module.vulnerability.split(' ')[0]}</span>
                      </div>
                      <Button size="sm" className="gap-1">
                        <Zap className="w-3 h-3" />
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}