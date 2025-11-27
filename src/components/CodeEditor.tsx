'use client'

import { useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  code: string
  language: string
  isDarkMode: boolean
  readOnly?: boolean
  onChange?: (value: string) => void
}

export function CodeEditor({ code, language, isDarkMode, readOnly = false, onChange }: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    // Configure Solidity language support
    monaco.languages.register({ id: 'solidity' })
    
    monaco.languages.setMonarchTokensProvider('solidity', {
      tokenizer: {
        root: [
          // Solidity keywords
          [/\b(contract|function|modifier|event|struct|enum|library|interface|using|pragma|solidity)\b/, 'keyword'],
          [/\b(address|uint|int|bool|string|bytes|mapping|storage|memory|calldata)\b/, 'type'],
          [/\b(public|private|internal|external|view|pure|payable|constant|immutable|virtual|override)\b/, 'keyword'],
          [/\b(if|else|for|while|do|break|continue|return|throw|revert|require|assert|emit)\b/, 'keyword'],
          [/\b(msg|block|tx|this|super|now|suicide|selfdestruct)\b/, 'variable.predefined'],
          [/\b(true|false|null|nil|undefined)\b/, 'constant.language'],
          [/\b(wei|ether|seconds|minutes|hours|days|weeks)\b/, 'variable.predefined'],
          
          // Numbers
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
          [/0[xX][0-9a-fA-F]+/, 'number.hex'],
          [/\d+/, 'number'],
          
          // Strings
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string_double'],
          [/'([^'\\]|\\.)*$/, 'string.invalid'],
          [/'/, 'string', '@string_single'],
          
          // Comments
          [/\/\/.*$/, 'comment'],
          [/\/\*/, 'comment', '@comment'],
          
          // Operators
          [/[+\-*\/=<>!&|%^~?:]/, 'operators'],
          
          // Punctuation
          [/[{}()\[\];,.]/, 'delimiter'],
          
          // Identifiers
          [/[a-zA-Z_]\w*/, 'identifier'],
        ],
        
        string_double: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, 'string', '@pop']
        ],
        
        string_single: [
          [/[^\\']+/, 'string'],
          [/\\./, 'string.escape'],
          [/'/, 'string', '@pop']
        ],
        
        comment: [
          [/[^\/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ]
      }
    })

    // Set theme
    monaco.editor.defineTheme('solidity-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569cd6' },
        { token: 'type', foreground: '4ec9b0' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'comment', foreground: '6a9955' },
        { token: 'variable.predefined', foreground: '9cdcfe' },
        { token: 'constant.language', foreground: '569cd6' },
        { token: 'operators', foreground: 'd4d4d4' },
        { token: 'delimiter', foreground: 'd4d4d4' },
        { token: 'identifier', foreground: 'd4d4d4' }
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4'
      }
    })

    monaco.editor.defineTheme('solidity-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0000ff' },
        { token: 'type', foreground: '267f99' },
        { token: 'string', foreground: 'a31515' },
        { token: 'number', foreground: '098658' },
        { token: 'comment', foreground: '008000' },
        { token: 'variable.predefined', foreground: '001080' },
        { token: 'constant.language', foreground: '0000ff' },
        { token: 'operators', foreground: '000000' },
        { token: 'delimiter', foreground: '000000' },
        { token: 'identifier', foreground: '000000' }
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000'
      }
    })

    // Set the appropriate theme
    monaco.editor.setTheme(isDarkMode ? 'solidity-dark' : 'solidity-light')
  }

  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco
      if (monaco) {
        monaco.editor.setTheme(isDarkMode ? 'solidity-dark' : 'solidity-light')
      }
    }
  }, [isDarkMode])

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language="solidity"
        value={code}
        theme={isDarkMode ? 'vs-dark' : 'vs-light'}
        onChange={(value) => onChange?.(value || '')}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: false,
          wordWrap: 'on',
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true
          },
          suggest: {
            showKeywords: true,
            showSnippets: true
          }
        }}
      />
    </div>
  )
}