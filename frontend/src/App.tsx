import { useState, useCallback } from 'react'

function App() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [error, setError] = useState('')

  const handleNumber = useCallback((num: string) => {
    setError('')
    if (display === '0' && num !== '.') {
      setDisplay(num)
      setExpression(num)
    } else {
      setDisplay(prev => prev + num)
      setExpression(prev => prev + num)
    }
  }, [display])

  const handleOperator = useCallback((op: string) => {
    setError('')
    const lastChar = expression.slice(-1)
    if (['+', '-', '*', '/'].includes(lastChar)) {
      setExpression(prev => prev.slice(0, -1) + op)
      setDisplay(op)
    } else {
      setExpression(prev => prev + op)
      setDisplay(op)
    }
  }, [expression])

  const handleClear = useCallback(() => {
    setDisplay('0')
    setExpression('')
    setError('')
  }, [])

  const handleCalculate = useCallback(async () => {
    if (!expression) return
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression })
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setDisplay(String(data.result))
        setExpression(String(data.result))
      }
    } catch (e) {
      setError('Network error')
    }
  }, [expression])

  const buttonStyle = {
    padding: '20px',
    fontSize: '1.2rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: 'bold'
  }

  return (
    <div style={{
      maxWidth: '320px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#1a1a2e',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        backgroundColor: '#16213e',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        minHeight: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
      }}>
        <div style={{
          color: '#8892b0',
          fontSize: '0.9rem',
          marginBottom: '5px',
          wordBreak: 'break-all'
        }}>
          {expression || '\u00a0'}
        </div>
        <div style={{
          color: error ? '#ff6b6b' : '#64ffda',
          fontSize: '2rem',
          fontWeight: 'bold',
          wordBreak: 'break-all'
        }}>
          {error || display}
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px'
      }}>
        <button 
          onClick={handleClear}
          style={{...buttonStyle, backgroundColor: '#ff6b6b', color: 'white', gridColumn: 'span 2'}}
        >
          C
        </button>
        <button 
          onClick={() => handleOperator('/')}
          style={{...buttonStyle, backgroundColor: '#0f3460', color: '#64ffda'}}
        >
          \u00f7
        </button>
        <button 
          onClick={() => handleOperator('*')}
          style={{...buttonStyle, backgroundColor: '#0f3460', color: '#64ffda'}}
        >
          \u00d7
        </button>
        
        <button onClick={() => handleNumber('7')} style={{...buttonStyle, backgroundColor: '#16213e', color: 'white'}}>7</button>
        <button onClick={() => handleNumber('8')} style={{...buttonStyle, backgroundColor: '#16213e', color: 'white'}}>8</button>
        <button onClick={() => handleNumber('9')} style={{...buttonStyle, backgroundColor: '#16213e', color: 'white'}}>9</button>
        <button 
          onClick={() => handleOperator('-')}
          style={{...buttonStyle, backgroundColor: '#0f3460', color: '#64ffda'}}
        >
          -
        </button>
        
        <button onClick={() => handleNumber('4')} style={{...buttonStyle, backgroundColor: '#16213e', color: 'white'}}>4</button>
        <button onClick={() => handleNumber('5')} style={{...buttonStyle, backgroundColor: '#16213e', color: 'white'}}>5</button>
        <button onClick={() => handleNumber('6')} style={{...buttonStyle, backgroundColor: '#16213e', color: 'white'}}>6</button>
        <button 
          onClick={() => handleOperator('+')}
          style={{...buttonStyle, backgroundColor: '#0f3460', color: '#64ffda'}}
        >
          +
        </button>
        
        <button onClick={() => handleNumber('1')} style={{...buttonStyle, backgroundColor: '#16213e', color: 'white'}}>1</button>
        <button onClick={() => handleNumber('2')} style={{...buttonStyle, backgroundColor: '#16213e', color: 'white'}}>2</button>
        <button onClick={() => handleNumber('3')} style={{...buttonStyle, backgroundColor: '#16213e', color: 'white'}}>3</button>
        <button 
          onClick={handleCalculate}
          style={{...buttonStyle, backgroundColor: '#64ffda', color: '#1a1a2e', gridRow: 'span 2'}}
        >
          =
        </button>
        
        <button onClick={() => handleNumber('0')} style={{...buttonStyle, backgroundColor: '#16213e', color: 'white', gridColumn: 'span 2'}}>0</button>
        <button onClick={() => handleNumber('.')} style={{...buttonStyle, backgroundColor: '#16213e', color: 'white'}}>.</button>
      </div>
    </div>
  )
}

export default App