'use client'

import { useState } from 'react'

export default function SecurityPlayground() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-600 mb-4">
            Security Playground
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Learn smart contract security by exploiting real vulnerabilities
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Learn by Doing</h3>
            <p className="text-slate-600">
              Run real exploits against vulnerable contracts
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Interactive Lessons</h3>
            <p className="text-slate-600">
              Hands-on security challenges
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Master Security</h3>
            <p className="text-slate-600">
              Fix vulnerabilities and verify solutions
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Security Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'reentrancy', title: 'Reentrancy', difficulty: 'Beginner' },
              { id: 'access-control', title: 'Access Control', difficulty: 'Beginner' },
              { id: 'integer-overflow', title: 'Integer Overflow', difficulty: 'Intermediate' },
              { id: 'unchecked-calls', title: 'Unchecked Calls', difficulty: 'Intermediate' },
              { id: 'front-running', title: 'Front Running', difficulty: 'Advanced' },
              { id: 'dos', title: 'Denial of Service', difficulty: 'Advanced' }
            ].map(module => (
              <div 
                key={module.id}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedModule(module.id)}
              >
                <h3 className="font-semibold mb-1">{module.title}</h3>
                <span className="text-sm text-slate-600">{module.difficulty}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedModule && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              Selected module: <strong>{selectedModule}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}