import { Box, Typography, Paper, Grid, Button } from '@mui/material'
import ReplayIcon from '@mui/icons-material/Replay'
import { TestQuestion } from '../MathTest/MathTest'
import { calculateResult } from '../../utils/testValidation'

interface TestResultsProps {
  questions: TestQuestion[]
  answers: Record<number, number>
  onNewTest: () => void
}

export function TestResults({ questions, answers, onNewTest }: TestResultsProps) {
  const correctAnswers = questions.filter(q => 
    !isNaN(answers[q.id]) && 
    answers[q.id] === calculateResult(q.firstNumber, q.secondNumber, q.operator as any)
  )

  const score = correctAnswers.length
  const total = questions.length
  const percentage = Math.round((score / total) * 100)

  return (
    <>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="primary.dark">
          Tulokset
        </Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Oikein: {score}/{total} ({percentage}%)
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ReplayIcon />}
          onClick={onNewTest}
          sx={{ mb: 4 }}
        >
          Tee uusi testi
        </Button>
      </Box>

      <Grid container spacing={3}>
        {questions.map((question) => {
          const userAnswer = answers[question.id]
          const correctAnswer = calculateResult(
            question.firstNumber, 
            question.secondNumber, 
            question.operator as any
          )
          const isCorrect = !isNaN(userAnswer) && userAnswer === correctAnswer
          const isUnanswered = isNaN(userAnswer)

          return (
            <Grid item xs={12} sm={6} key={question.id}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: isUnanswered 
                    ? 'grey.300'
                    : isCorrect 
                      ? 'success.main' 
                      : 'error.main',
                  backgroundColor: isUnanswered
                    ? 'grey.50'
                    : isCorrect
                      ? 'success.50'
                      : 'error.50',
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Tehtävä {question.id}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6">
                    {question.firstNumber} {question.operator} {question.secondNumber} = {' '}
                    {isUnanswered ? '-' : userAnswer}
                  </Typography>
                  {!isCorrect && (
                    <Typography 
                      variant="body1" 
                      color={isUnanswered ? 'text.secondary' : 'error.main'}
                    >
                      Oikea vastaus: {correctAnswer}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
} 