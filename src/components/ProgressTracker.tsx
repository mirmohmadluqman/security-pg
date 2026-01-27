'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Target, Clock, Award, Download, Share2 } from 'lucide-react'

interface ProgressStats {
  completedModules: number
  totalModules: number
  currentModule: string
  totalTime: number
  lastActivity: Date
  achievements: string[]
}

export function ProgressTracker() {
  const [stats, setStats] = useState<ProgressStats>({
    completedModules: 0,
    totalModules: 9,
    currentModule: 'None',
    totalTime: 0,
    lastActivity: new Date(),
    achievements: []
  })

  const [showCertificate, setShowCertificate] = useState(false)

  useEffect(() => {
    loadProgress()
  }, [])

  const loadProgress = () => {
    try {
      const completedModules = JSON.parse(localStorage.getItem('completed-modules') || '[]')
      const totalTime = parseInt(localStorage.getItem('total-time') || '0')
      const lastActivity = new Date(localStorage.getItem('last-activity') || Date.now())
      const achievements = JSON.parse(localStorage.getItem('achievements') || '[]')

      setStats({
        completedModules: completedModules.length,
        totalModules: 9,
        currentModule: localStorage.getItem('current-module') || 'None',
        totalTime,
        lastActivity,
        achievements
      })
    } catch (error) {
      console.error('Failed to load progress:', error)
    }
  }

  const progressPercentage = (stats.completedModules / stats.totalModules) * 100

  const getAchievementBadge = (achievement: string) => {
    const badges: Record<string, { icon: React.ReactNode; color: string; title: string }> = {
      'first-exploit': {
        icon: <Target className="w-4 h-4" />,
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        title: 'First Exploit'
      },
      'reentrancy-master': {
        icon: <Trophy className="w-4 h-4" />,
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        title: 'Reentrancy Master'
      },
      'security-expert': {
        icon: <Award className="w-4 h-4" />,
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        title: 'Security Expert'
      },
      'quick-learner': {
        icon: <Clock className="w-4 h-4" />,
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        title: 'Quick Learner'
      }
    }

    const badge = badges[achievement] || {
      icon: <Trophy className="w-4 h-4" />,
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      title: achievement
    }

    return (
      <Badge key={achievement} className={badge.color}>
        {badge.icon}
        <span className="ml-1">{badge.title}</span>
      </Badge>
    )
  }

  const downloadCertificate = () => {
    const certificateData = {
      name: 'Security Playground Graduate',
      completionDate: new Date().toISOString(),
      modulesCompleted: stats.completedModules,
      totalTime: stats.totalTime,
      achievements: stats.achievements
    }

    const blob = new Blob([JSON.stringify(certificateData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-playground-certificate-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareProgress = () => {
    const shareText = `I've completed ${stats.completedModules}/${stats.totalModules} modules in Security Playground! 🎯`
    
    if (navigator.share) {
      navigator.share({
        title: 'Security Playground Progress',
        text: shareText
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Progress copied to clipboard!')
    }
  }

  const canEarnCertificate = stats.completedModules === stats.totalModules

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Your Progress
          </CardTitle>
          <CardDescription>
            Track your learning journey and achievements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Modules Completed</span>
              <span className="font-medium">
                {stats.completedModules} / {stats.totalModules}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {progressPercentage.toFixed(0)}% Complete
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600 dark:text-slate-400">Current Module:</span>
              <p className="font-medium">{stats.currentModule}</p>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Total Time:</span>
              <p className="font-medium">{Math.floor(stats.totalTime / 60)} minutes</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareProgress}
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            {canEarnCertificate && (
              <Button
                size="sm"
                onClick={() => setShowCertificate(true)}
                className="flex-1"
              >
                <Award className="w-4 h-4 mr-2" />
                Get Certificate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {stats.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.achievements.map(achievement => getAchievementBadge(achievement))}
            </div>
          </CardContent>
        </Card>
      )}

      {showCertificate && (
        <Card className="border-2 border-yellow-300 dark:border-yellow-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <Trophy className="w-6 h-6" />
              Certificate of Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Security Playground Graduate</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Successfully completed all {stats.totalModules} security modules
              </p>
              <p className="text-sm text-slate-500">
                Completed on {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCertificate}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Certificate
              </Button>
              
              <Button
                size="sm"
                onClick={() => setShowCertificate(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}