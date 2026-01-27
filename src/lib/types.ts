export interface SecurityModule {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  vulnerableCode: string
  attackCode: string
  fixedCode: string
  explanation: string
  vulnerability: string
  impact: string
  prevention: string
  references: string[]
  isRealWorld?: boolean
  loss?: string
  date?: string
  images?: string[]
}

export interface DVDChallenge {
  id: string
  title: string
  subtitle: string
  scenario: string
  objective: string
  rules: string[]
  difficulty: 'intermediate' | 'advanced'
  category: 'DeFi' | 'Governance' | 'Lending' | 'Flash Loans' | 'Oracles'
  contracts: Array<{
    name: string
    code: string
    path: string
  }>
  testCode: string
  exploitHint?: string
  remixUrl?: string
}

export interface DeFiVulnSample {
  id: string
  title: string
  description: string
  category: string
  code: string
  mitigation: string
  sourceUrl: string
}

export interface VMState {
  logs: string[]
  isRunning: boolean
  error: string | null
  contracts: Map<string, any>
  accounts: string[]
}

export interface UserProgress {
  completedModules: string[]
  currentModule: string | null
  scores: Record<string, number>
  startedAt: Date
  lastActivity: Date
}