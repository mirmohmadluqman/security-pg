'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Crown, Star, Users, TrendingUp } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  username: string
  avatar: string
  points: number
  completedModules: number
  totalTime: number
  badges: string[]
  recentActivity: string
}

export function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState<'all-time' | 'monthly' | 'weekly'>('all-time')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    // Mock leaderboard data - in real implementation, this would come from a backend
    const mockData: LeaderboardEntry[] = [
      {
        rank: 1,
        username: 'SecurityNinja',
        avatar: '🥷',
        points: 2850,
        completedModules: 9,
        totalTime: 180,
        badges: ['Expert', 'Speed Demon', 'Perfect Score'],
        recentActivity: 'Completed Storage Collision module'
      },
      {
        rank: 2,
        username: 'SolidityMaster',
        avatar: '🧙',
        points: 2720,
        completedModules: 9,
        totalTime: 165,
        badges: ['Expert', 'Bug Hunter'],
        recentActivity: 'Achieved perfect score on DoS module'
      },
      {
        rank: 3,
        username: 'CryptoWhale',
        avatar: '🐋',
        points: 2650,
        completedModules: 8,
        totalTime: 200,
        badges: ['Expert', 'Persistent'],
        recentActivity: 'Completed Front-Running module'
      },
      {
        rank: 4,
        username: 'DeFiDev',
        avatar: '🦊',
        points: 2400,
        completedModules: 8,
        totalTime: 145,
        badges: ['Advanced', 'Quick Learner'],
        recentActivity: 'Completed TX-Origin module'
      },
      {
        rank: 5,
        username: 'BlockchainBuddy',
        avatar: '��',
        points: 2200,
        completedModules: 7,
        totalTime: 190,
        badges: ['Advanced'],
        recentActivity: 'Completed Integer Overflow module'
      },
      {
        rank: 6,
        username: 'SmartContractSam',
        avatar: '🎯',
        points: 1950,
        completedModules: 6,
        totalTime: 120,
        badges: ['Intermediate'],
        recentActivity: 'Completed Access Control module'
      },
      {
        rank: 7,
        username: 'EthExplorer',
        avatar: '🚀',
        points: 1750,
        completedModules: 6,
        totalTime: 210,
        badges: ['Intermediate'],
        recentActivity: 'Completed Reentrancy module'
      },
      {
        rank: 8,
        username: 'CodeCracker',
        avatar: '💻',
        points: 1600,
        completedModules: 5,
        totalTime: 95,
        badges: ['Intermediate', 'Speed Demon'],
        recentActivity: 'Completed Unchecked Calls module'
      }
    ]

    setLeaderboard(mockData)
  }, [timeFilter])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />
      case 2: return <Medal className="w-5 h-5 text-gray-400" />
      case 3: return <Medal className="w-5 h-5 text-orange-600" />
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-slate-500">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
  }

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      'Expert': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Advanced': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Intermediate': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Speed Demon': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Perfect Score': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Bug Hunter': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Persistent': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Quick Learner': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    }
    return colors[badge] || 'bg-gray-100 text-gray-800'
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const totalParticipants = 1247
  const yourRank = 42 // Mock user rank
  const yourPoints = 850 // Mock user points

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Security Leaderboard
          </CardTitle>
          <CardDescription>
            Top performers in the Security Playground community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {totalParticipants.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  #{yourRank}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Your Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {yourPoints}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Your Points</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {(['all-time', 'monthly', 'weekly'] as const).map(filter => (
                <Button
                  key={filter}
                  variant={timeFilter === filter ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeFilter(filter)}
                >
                  {filter === 'all-time' ? 'All Time' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {leaderboard.map((entry) => (
          <Card 
            key={entry.rank} 
            className={`transition-all duration-200 hover:shadow-md ${
              entry.rank <= 3 ? 'border-2 border-yellow-200 dark:border-yellow-800' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadge(entry.rank)}`}>
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{entry.avatar}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{entry.username}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {entry.recentActivity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-500">{entry.points}</div>
                    <div className="text-xs text-slate-500">Points</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold">{entry.completedModules}/9</div>
                    <div className="text-xs text-slate-500">Modules</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold">{formatTime(entry.totalTime)}</div>
                    <div className="text-xs text-slate-500">Time</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {entry.badges.slice(0, 2).map(badge => (
                      <Badge key={badge} className={getBadgeColor(badge)}>
                        {badge}
                      </Badge>
                    ))}
                    {entry.badges.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{entry.badges.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Your Progress</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  You're in the top 5% of participants! Keep going to reach the leaderboard.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-lg font-bold text-blue-800 dark:text-blue-200">
                  {totalParticipants - yourRank}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">players ahead</div>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Learning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}