'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Lock, Unlock, Trophy, Target, Code, Zap, Shield } from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  points: number
  timeLimit: number // in minutes
  hint: string
  isUnlocked: boolean
  isCompleted: boolean
  bestScore?: number
}

export function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'reentrancy-basic',
      title: 'Basic Reentrancy',
      description: 'Identify and fix a simple reentrancy vulnerability in a withdrawal function',
      difficulty: 'easy',
      category: 'Reentrancy',
      points: 100,
      timeLimit: 15,
      hint: 'Look for external calls before state updates',
      isUnlocked: true,
      isCompleted: false
    },
    {
      id: 'access-control-complex',
      title: 'Complex Access Control',
      description: 'Implement proper role-based access control for a multi-signature wallet',
      difficulty: 'medium',
      category: 'Access Control',
      points: 250,
      timeLimit: 30,
      hint: 'Use modifiers and role mappings',
      isUnlocked: true,
      isCompleted: false
    },
    {
      id: 'overflow-edge-cases',
      title: 'Overflow Edge Cases',
      description: 'Handle integer overflow in complex mathematical operations',
      difficulty: 'hard',
      category: 'Arithmetic',
      points: 500,
      timeLimit: 45,
      hint: 'Consider SafeMath or Solidity 0.8+ built-in checks',
      isUnlocked: false,
      isCompleted: false
    },
    {
      id: 'mev-sandwich',
      title: 'MEV Sandwich Attack',
      description: 'Implement protection against sandwich attacks in a DEX',
      difficulty: 'hard',
      category: 'MEV',
      points: 750,
      timeLimit: 60,
      hint: 'Use commit-reveal schemes or time-based delays',
      isUnlocked: false,
      isCompleted: false
    },
    {
      id: 'proxy-storage',
      title: 'Proxy Storage Clash',
      description: 'Fix storage collision issues in an upgradeable proxy contract',
      difficulty: 'hard',
      category: 'Proxy',
      points: 600,
      timeLimit: 40,
      hint: 'Follow EIP-1967 storage layout standards',
      isUnlocked: false,
      isCompleted: false
    }
  ])

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      // Handle timeout
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeRemaining])

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setTimeRemaining(challenge.timeLimit * 60) // Convert to seconds
    setIsTimerRunning(true)
    setShowHint(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Reentrancy': return <Zap className="w-4 h-4" />
      case 'Access Control': return <Lock className="w-4 h-4" />
      case 'Arithmetic': return <Code className="w-4 h-4" />
      case 'MEV': return <Target className="w-4 h-4" />
      case 'Proxy': return <Shield className="w-4 h-4" />
      default: return <Trophy className="w-4 h-4" />
    }
  }

  const totalPoints = challenges.reduce((sum, challenge) => sum + challenge.points, 0)
  const completedPoints = challenges
    .filter(challenge => challenge.isCompleted)
    .reduce((sum, challenge) => sum + challenge.points, 0)
  const progressPercentage = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0

  if (selectedChallenge) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedChallenge.title}</h2>
            <p className="text-slate-600 dark:text-slate-400">{selectedChallenge.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-slate-500">Time Remaining</div>
            </div>
            <Button variant="outline" onClick={() => setSelectedChallenge(null)}>
              Back to Challenges
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{selectedChallenge.points}</div>
              <div className="text-xs text-slate-500">Points</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Badge className={getDifficultyColor(selectedChallenge.difficulty)}>
                {selectedChallenge.difficulty}
              </Badge>
              <div className="text-xs text-slate-500 mt-2">Difficulty</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                {getCategoryIcon(selectedChallenge.category)}
                <span className="text-sm">{selectedChallenge.category}</span>
              </div>
              <div className="text-xs text-slate-500 mt-2">Category</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{selectedChallenge.timeLimit}m</div>
              <div className="text-xs text-slate-500">Time Limit</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Challenge Workspace</CardTitle>
            <CardDescription>
              Write your solution in the editor below and test it against the test cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  <span className="font-medium">Solution Editor</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                  >
                    {showHint ? 'Hide' : 'Show'} Hint
                  </Button>
                  <Button size="sm">
                    Submit Solution
                  </Button>
                </div>
              </div>
              
              {showHint && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800 dark:text-blue-200">Hint</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {selectedChallenge.hint}
                  </p>
                </div>
              )}
              
              <div className="h-96 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                <p className="text-slate-500">Code editor would be integrated here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Security Challenges
          </CardTitle>
          <CardDescription>
            Test your skills with these hands-on security challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{completedPoints}/{totalPoints}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Points Earned</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Complete</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {challenges.map(challenge => (
          <Card 
            key={challenge.id} 
            className={`transition-all duration-200 ${
              challenge.isCompleted 
                ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' 
                : challenge.isUnlocked
                ? 'hover:shadow-md cursor-pointer'
                : 'opacity-60 cursor-not-allowed'
            }`}
            onClick={() => challenge.isUnlocked && startChallenge(challenge)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {challenge.isUnlocked ? (
                      <Unlock className="w-5 h-5 text-green-500" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    {challenge.isCompleted && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Completed
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {challenge.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(challenge.category)}
                      <span>{challenge.category}</span>
                    </div>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>{challenge.points} pts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span>{challenge.timeLimit}m</span>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  {challenge.isUnlocked ? (
                    <Button size="sm">
                      {challenge.isCompleted ? 'Retry' : 'Start'}
                    </Button>
                  ) : (
                    <Button size="sm" disabled>
                      Locked
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}