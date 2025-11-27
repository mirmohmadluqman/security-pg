// Simplified EVM Simulator for Security Playground
// This is a basic simulation for educational purposes

export interface Account {
  address: string
  balance: bigint
  nonce: number
}

export interface Contract {
  address: string
  bytecode: string
  storage: Map<string, string>
  codeHash: string
}

export interface Transaction {
  from: string
  to: string
  value: bigint
  data: string
  gasLimit: bigint
  gasPrice: bigint
}

export interface Block {
  number: number
  hash: string
  timestamp: number
  gasLimit: bigint
}

export class EVM {
  private accounts: Map<string, Account> = new Map()
  private contracts: Map<string, Contract> = new Map()
  private currentBlock: Block
  private gasUsed: bigint = 0n

  constructor() {
    this.currentBlock = {
      number: 1,
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      timestamp: Date.now(),
      gasLimit: 30000000n
    }
    
    // Initialize with some test accounts
    this.initializeTestAccounts()
  }

  private initializeTestAccounts() {
    const testAccounts = [
      '0x1234567890123456789012345678901234567890',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      '0x1111111111111111111111111111111111111111',
      '0x2222222222222222222222222222222222222222'
    ]

    testAccounts.forEach(address => {
      this.accounts.set(address, {
        address,
        balance: 100000000000000000000n, // 100 ETH
        nonce: 0
      })
    })
  }

  public createAccount(address: string, balance: bigint = 1000000000000000000n): Account {
    const account: Account = {
      address,
      balance,
      nonce: 0
    }
    this.accounts.set(address, account)
    return account
  }

  public getAccount(address: string): Account | undefined {
    return this.accounts.get(address)
  }

  public deployContract(bytecode: string, deployer: string): string {
    const contractAddress = this.generateContractAddress(deployer, this.accounts.get(deployer)?.nonce || 0)
    
    const contract: Contract = {
      address: contractAddress,
      bytecode,
      storage: new Map(),
      codeHash: this.hash(bytecode)
    }
    
    this.contracts.set(contractAddress, contract)
    return contractAddress
  }

  public executeTransaction(tx: Transaction): { success: boolean; gasUsed: bigint; logs: string[] } {
    const logs: string[] = []
    let gasUsed = 21000n // Base transaction cost
    
    try {
      const fromAccount = this.accounts.get(tx.from)
      if (!fromAccount) {
        throw new Error('Sender account not found')
      }

      if (fromAccount.balance < tx.value + (gasUsed * tx.gasPrice)) {
        throw new Error('Insufficient balance')
      }

      // Deduct gas cost
      fromAccount.balance -= gasUsed * tx.gasPrice
      fromAccount.nonce++

      const toAccount = this.accounts.get(tx.to)
      const contract = this.contracts.get(tx.to)

      if (contract) {
        // Contract execution
        const result = this.executeContract(contract, tx, fromAccount)
        gasUsed += result.gasUsed
        logs.push(...result.logs)
        
        if (!result.success) {
          throw new Error('Contract execution failed')
        }
      } else if (toAccount) {
        // Simple ETH transfer
        fromAccount.balance -= tx.value
        toAccount.balance += tx.value
        logs.push(`Transferred ${this.formatEther(tx.value)} ETH from ${tx.from} to ${tx.to}`)
      } else {
        // Create new account if it doesn't exist
        this.createAccount(tx.to)
        fromAccount.balance -= tx.value
        this.accounts.get(tx.to)!.balance += tx.value
        logs.push(`Created account ${tx.to} and transferred ${this.formatEther(tx.value)} ETH`)
      }

      this.gasUsed += gasUsed
      return { success: true, gasUsed, logs }
    } catch (error) {
      logs.push(`Transaction failed: ${error}`)
      return { success: false, gasUsed, logs }
    }
  }

  private executeContract(contract: Contract, tx: Transaction, sender: Account): { success: boolean; gasUsed: bigint; logs: string[] } {
    const logs: string[] = []
    let gasUsed = 0n

    try {
      // Simplified contract execution
      logs.push(`Executing contract at ${contract.address}`)
      logs.push(`Function selector: ${tx.data.slice(0, 10)}`)
      
      // Simulate different function calls based on data
      const functionSelector = tx.data.slice(0, 10)
      
      switch (functionSelector) {
        case '0x8da5cb5b': // owner()
          logs.push('Getting owner address')
          break
        case '0x27dce7ec': // withdraw()
          logs.push('Withdrawing funds...')
          if (contract.address.includes('vulnerable')) {
            logs.push('⚠️  Reentrancy vulnerability detected!')
            logs.push('Recursive call executed before balance update')
          }
          break
        case '0xa9059cbb': // transfer(address,uint256)
          logs.push('Transferring tokens...')
          if (contract.address.includes('vulnerable')) {
            logs.push('⚠️  Access control vulnerability detected!')
            logs.push('Unauthorized token minting possible')
          }
          break
        case '0x40c10f19': // mint(address,uint256)
          logs.push('Minting tokens...')
          break
        default:
          logs.push('Unknown function call')
      }

      gasUsed = 50000n // Simplified gas calculation
      return { success: true, gasUsed, logs }
    } catch (error) {
      logs.push(`Contract execution error: ${error}`)
      return { success: false, gasUsed, logs }
    }
  }

  private generateContractAddress(deployer: string, nonce: number): string {
    // Simplified address generation
    const hash = this.hash(deployer + nonce.toString())
    return '0x' + hash.slice(26)
  }

  private hash(data: string): string {
    // Simple hash simulation (in real implementation, use keccak256)
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(64, '0')
  }

  private formatEther(wei: bigint): string {
    return (Number(wei) / 1e18).toFixed(6)
  }

  public getBalance(address: string): bigint {
    const account = this.accounts.get(address)
    return account ? account.balance : 0n
  }

  public getContract(address: string): Contract | undefined {
    return this.contracts.get(address)
  }

  public getCurrentBlock(): Block {
    return this.currentBlock
  }

  public mineBlock() {
    this.currentBlock = {
      number: this.currentBlock.number + 1,
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      timestamp: Date.now(),
      gasLimit: 30000000n
    }
  }

  // Simulate specific vulnerabilities
  public simulateReentrancy(victimAddress: string, attackerAddress: string): { success: boolean; logs: string[] } {
    const logs: string[] = []
    const victim = this.contracts.get(victimAddress)
    const attacker = this.accounts.get(attackerAddress)

    if (!victim || !attacker) {
      return { success: false, logs: ['Contract or account not found'] }
    }

    logs.push('🎯 Starting reentrancy attack...')
    logs.push(`Initial victim balance: ${this.formatEther(this.getBalance(victimAddress))} ETH`)
    logs.push(`Initial attacker balance: ${this.formatEther(attacker.balance)} ETH`)

    // Simulate the attack
    const victimBalance = this.getBalance(victimAddress)
    if (victimBalance > 0n) {
      // Attacker calls withdraw()
      logs.push('📤 Attacker calls withdraw()...')
      
      // Victim contract sends ETH before updating balance (vulnerability)
      logs.push('💸 Victim contract sends ETH to attacker...')
      attacker.balance += victimBalance
      
      // Attacker's fallback function calls withdraw() again
      logs.push('🔄 Attacker\'s fallback function triggers reentrancy...')
      logs.push('📤 Recursive call to withdraw()...')
      
      // Since balance wasn't updated, attacker can withdraw again
      logs.push('💸 Second withdrawal successful!')
      attacker.balance += victimBalance
      
      // Update victim balance (too late)
      this.accounts.get(victimAddress)!.balance = 0n
      
      logs.push(`Final victim balance: ${this.formatEther(0n)} ETH`)
      logs.push(`Final attacker balance: ${this.formatEther(attacker.balance)} ETH`)
      logs.push('🚨 REENTRANCY ATTACK SUCCESSFUL!')
      
      return { success: true, logs }
    }

    return { success: false, logs: ['No funds to drain'] }
  }

  public simulateAccessControl(contractAddress: string, attackerAddress: string): { success: boolean; logs: string[] } {
    const logs: string[] = []
    
    logs.push('🎯 Starting access control attack...')
    logs.push(`Attacker address: ${attackerAddress}`)
    
    // Simulate calling a protected function without access
    logs.push('📤 Attacker calls mint() function...')
    logs.push('⚠️  No access control check detected!')
    logs.push('💰 Unauthorized minting successful!')
    logs.push('📈 Attacker receives 1000 tokens')
    
    return { success: true, logs }
  }

  public getStats() {
    return {
      totalAccounts: this.accounts.size,
      totalContracts: this.contracts.size,
      currentBlock: this.currentBlock.number,
      totalGasUsed: this.gasUsed
    }
  }
}