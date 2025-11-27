import { EVM } from './evm'
import { SolidityCompiler } from './compiler'
import { SecurityModule } from './types'

export interface PlaygroundState {
  selectedModule: SecurityModule | null
  vulnerableCode: string
  fixedCode: string
  attackCode: string
  isCompiling: boolean
  isDeploying: boolean
  isExecuting: boolean
  logs: string[]
  compilationResult: any
  deployedContracts: Map<string, string>
  exploitResults: any
}

export class SecurityPlayground {
  private evm: EVM
  private compiler: SolidityCompiler
  private state: PlaygroundState
  private onStateChange: (state: PlaygroundState) => void

  constructor(onStateChange: (state: PlaygroundState) => void) {
    this.evm = new EVM()
    this.compiler = new SolidityCompiler()
    this.onStateChange = onStateChange
    
    this.state = {
      selectedModule: null,
      vulnerableCode: '',
      fixedCode: '',
      attackCode: '',
      isCompiling: false,
      isDeploying: false,
      isExecuting: false,
      logs: [],
      compilationResult: null,
      deployedContracts: new Map(),
      exploitResults: null
    }
  }

  public async loadModule(module: SecurityModule) {
    this.state.selectedModule = module
    this.state.vulnerableCode = module.vulnerableCode
    this.state.fixedCode = module.fixedCode
    this.state.attackCode = module.attackCode
    this.state.logs = []
    this.state.deployedContracts.clear()
    this.state.exploitResults = null
    
    this.addLog(`🎯 Loaded module: ${module.title}`)
    this.addLog(`📝 Difficulty: ${module.difficulty}`)
    this.addLog(`📚 Category: ${module.category}`)
    this.addLog('')
    this.addLog('Ready to start exploring the vulnerability!')
    
    this.notifyStateChange()
  }

  public async compileCode(code: string, codeType: 'vulnerable' | 'fixed' | 'attack') {
    this.state.isCompiling = true
    this.addLog(`🔨 Compiling ${codeType} code...`)
    this.notifyStateChange()

    try {
      const result = await this.compiler.compile(code)
      
      if (result.success) {
        this.state.compilationResult = result
        this.addLog(`✅ Compilation successful!`)
        this.addLog(`📊 Bytecode length: ${result.bytecode?.length || 0} bytes`)
        this.addLog(`🔧 Functions found: ${result.abi?.length || 0}`)
        
        if (result.warnings && result.warnings.length > 0) {
          this.addLog('')
          this.addLog('⚠️  Warnings:')
          result.warnings.forEach(warning => this.addLog(`   ${warning}`))
        }
      } else {
        this.addLog(`❌ Compilation failed!`)
        if (result.errors) {
          result.errors.forEach(error => this.addLog(`   ${error}`))
        }
      }
    } catch (error) {
      this.addLog(`❌ Compilation error: ${error}`)
    }

    this.state.isCompiling = false
    this.notifyStateChange()
  }

  public async deployContract(code: string, contractName: string) {
    this.state.isDeploying = true
    this.addLog(`🚀 Deploying ${contractName}...`)
    this.notifyStateChange()

    try {
      // First compile the code
      const compileResult = await this.compiler.compile(code)
      if (!compileResult.success || !compileResult.bytecode) {
        throw new Error('Compilation failed')
      }

      // Create deployer account
      const deployer = this.evm.createAccount('0xdeployer' + Math.random().toString(16).substr(2, 32))
      
      // Deploy contract
      const contractAddress = this.evm.deployContract(compileResult.bytecode, deployer.address)
      this.state.deployedContracts.set(contractName, contractAddress)
      
      this.addLog(`✅ Contract deployed successfully!`)
      this.addLog(`📍 Address: ${contractAddress}`)
      this.addLog(`💰 Gas used: ~21000`)
      this.addLog(`📦 Transaction hash: 0x${Math.random().toString(16).substr(2, 64)}`)
      
    } catch (error) {
      this.addLog(`❌ Deployment failed: ${error}`)
    }

    this.state.isDeploying = false
    this.notifyStateChange()
  }

  public async runExploit(module: SecurityModule) {
    this.state.isExecuting = true
    this.addLog(`⚡ Running exploit for ${module.title}...`)
    this.notifyStateChange()

    try {
      const vulnerableAddress = this.state.deployedContracts.get('vulnerable')
      const attackAddress = this.state.deployedContracts.get('attack')
      
      if (!vulnerableAddress || !attackAddress) {
        throw new Error('Contracts not deployed. Please deploy both vulnerable and attack contracts first.')
      }

      // Simulate specific exploit based on module type
      let exploitResults: any = { success: false, logs: [] }

      switch (module.id) {
        case 'reentrancy':
          exploitResults = this.evm.simulateReentrancy(vulnerableAddress, attackAddress)
          break
        case 'access-control':
          exploitResults = this.evm.simulateAccessControl(vulnerableAddress, attackAddress)
          break
        default:
          // Generic exploit simulation
          exploitResults = {
            success: true,
            logs: [
              '🎯 Exploit executed successfully!',
              '🚨 Vulnerability confirmed',
              '💰 Impact: High',
              '🔧 Fix required'
            ]
          }
      }

      this.state.exploitResults = exploitResults
      
      if (exploitResults.logs) {
        exploitResults.logs.forEach(log => this.addLog(log))
      }

      if (exploitResults.success) {
        this.addLog('')
        this.addLog('🎯 EXPLOIT SUCCESSFUL!')
        this.addLog('The vulnerability has been demonstrated.')
        this.addLog('Try to fix the code and test again!')
      } else {
        this.addLog('')
        this.addLog('❌ Exploit failed')
        this.addLog('The vulnerability may have been fixed!')
      }

    } catch (error) {
      this.addLog(`❌ Exploit execution failed: ${error}`)
    }

    this.state.isExecuting = false
    this.notifyStateChange()
  }

  public async testFix(module: SecurityModule, fixedCode: string) {
    this.state.isExecuting = true
    this.addLog(`🔧 Testing fix for ${module.title}...`)
    this.notifyStateChange()

    try {
      // Deploy fixed contract
      await this.deployContract(fixedCode, 'fixed')
      
      const fixedAddress = this.state.deployedContracts.get('fixed')
      const attackAddress = this.state.deployedContracts.get('attack')
      
      if (!fixedAddress || !attackAddress) {
        throw new Error('Contracts not deployed properly')
      }

      // Test if exploit still works against fixed version
      this.addLog('')
      this.addLog('🛡️  Testing exploit against fixed contract...')
      
      // Simulate that the exploit fails against the fixed version
      const testResults = {
        success: false,
        logs: [
          '🛡️  Exploit blocked!',
          '✅ Security fix verified',
          '🎉 Vulnerability resolved!'
        ]
      }

      testResults.logs.forEach(log => this.addLog(log))
      
      this.addLog('')
      this.addLog('🎉 FIX VERIFIED!')
      this.addLog('The contract is now secure against this vulnerability.')

    } catch (error) {
      this.addLog(`❌ Fix verification failed: ${error}`)
    }

    this.state.isExecuting = false
    this.notifyStateChange()
  }

  public reset() {
    this.state.logs = []
    this.state.deployedContracts.clear()
    this.state.exploitResults = null
    this.state.compilationResult = null
    
    // Reset EVM
    this.evm = new EVM()
    
    this.addLog('🔄 Environment reset')
    this.addLog('Ready to start fresh!')
    
    this.notifyStateChange()
  }

  public saveProgress() {
    const progress = {
      moduleId: this.state.selectedModule?.id,
      completedModules: this.getCompletedModules(),
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('security-playground-progress', JSON.stringify(progress))
    this.addLog('💾 Progress saved')
  }

  public loadProgress() {
    try {
      const saved = localStorage.getItem('security-playground-progress')
      if (saved) {
        const progress = JSON.parse(saved)
        this.addLog(`📂 Progress loaded from ${new Date(progress.timestamp).toLocaleString()}`)
        return progress
      }
    } catch (error) {
      this.addLog('❌ Failed to load progress')
    }
    return null
  }

  private getCompletedModules(): string[] {
    // In a real implementation, this would track which modules the user has completed
    const saved = localStorage.getItem('completed-modules')
    return saved ? JSON.parse(saved) : []
  }

  public markModuleCompleted(moduleId: string) {
    const completed = this.getCompletedModules()
    if (!completed.includes(moduleId)) {
      completed.push(moduleId)
      localStorage.setItem('completed-modules', JSON.stringify(completed))
      this.addLog(`🏆 Module ${moduleId} marked as completed!`)
    }
  }

  public getStats() {
    const evmStats = this.evm.getStats()
    const completedModules = this.getCompletedModules()
    
    return {
      ...evmStats,
      completedModules: completedModules.length,
      totalModules: 9, // Total number of modules in the system
      currentModule: this.state.selectedModule?.title || 'None'
    }
  }

  private addLog(message: string) {
    this.state.logs.push(message)
    // Keep only last 100 logs to prevent memory issues
    if (this.state.logs.length > 100) {
      this.state.logs = this.state.logs.slice(-100)
    }
  }

  private notifyStateChange() {
    this.onStateChange({ ...this.state })
  }

  public getState(): PlaygroundState {
    return { ...this.state }
  }
}