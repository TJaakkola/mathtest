import { Container, Paper, Typography, useMediaQuery, ThemeProvider, createTheme } from '@mui/material'
import { useState } from 'react'
import { TestParameters, TestParametersData } from './components/TestParameters/TestParameters'
import { MathTest, TestQuestion } from './components/MathTest/MathTest'
import { generateMathTest } from './services/testGenerator'
import styles from './App.module.css'
import { TestResults } from './components/TestResults/TestResults'

const theme = createTheme({
  palette: {
    primary: {
      main: '#fb8c00', 
      light: '#ffbd45',
      dark: '#c25e00',
    },
    secondary: {
      main: '#ffd54f', // Warm yellow
      light: '#ffff81',
      dark: '#c8a415',
    },
    background: {
      default: '#fff8e1',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
  },
})

function App() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [showParameters, setShowParameters] = useState(true)
  const [test, setTest] = useState<TestQuestion[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)

  const handleGenerateTest = (parameters: TestParametersData) => {
    const questions = generateMathTest(parameters)
    setTest(questions)
    setShowParameters(false)
    setShowResults(false)
    setAnswers({})
  }

  const handleCloseTest = () => {
    setShowParameters(true)
    setTest([])
    setAnswers({})
    setShowResults(false)
  }

  const handleTestSubmit = (answers: Record<number, number>) => {
    setAnswers(answers)
    setShowResults(true)
  }

  const getContent = () => {
    if (showParameters) {
      return <TestParameters onSubmit={handleGenerateTest} />
    }
    if (showResults) {
      return (
        <TestResults 
          questions={test}
          answers={answers}
          onNewTest={handleCloseTest}
        />
      )
    }
    return (
      <MathTest 
        questions={test} 
        onClose={handleCloseTest}
        onSubmit={handleTestSubmit}
      />
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" className={styles.container}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: isMobile ? 2 : 4,
            mt: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: isMobile ? '2rem' : '2.5rem',
              background: 'linear-gradient(120deg, #fb8c00, #ffbd45)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              mb: 4,
              fontWeight: 700,
            }}
          >
            Matikan koe
          </Typography>

          {getContent()}
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

export default App
