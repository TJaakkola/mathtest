import { Grid, Paper, Typography, useTheme, Button, Box, TextField, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'

export interface TestQuestion {
  id: number
  firstNumber: number
  secondNumber: number
  operator: string
  answer: number
}

interface MathTestProps {
  questions: TestQuestion[]
  onClose: () => void
  onSubmit: (answers: Record<number, number>) => void
}

export function MathTest({ questions, onClose, onSubmit }: MathTestProps) {
  const theme = useTheme()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleAnswerChange = (questionId: number, value: string) => {
    const numValue = value === '' ? NaN : Number(value)
    setAnswers(prev => ({
      ...prev,
      [questionId]: numValue
    }))
  }

  const answeredCount = Object.values(answers).filter(v => !isNaN(v)).length
  const progress = (answeredCount / questions.length) * 100
  const hasUnansweredQuestions = answeredCount < questions.length

  const handleSubmitClick = () => {
    if (hasUnansweredQuestions) {
      setShowConfirmDialog(true)
    } else {
      onSubmit(answers)
    }
  }

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false)
    onSubmit(answers)
  }

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Vastattu: {answeredCount}/{questions.length}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CloseIcon />}
            onClick={onClose}
            sx={{
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            Palaa alkuun
          </Button>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(251, 140, 0, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.primary.main,
            }
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {questions.map((question) => (
          <Grid item xs={12} sm={6} key={question.id}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                background: theme.palette.background.paper,
                borderColor: 'primary.light',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Tehtävä {question.id}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  {question.firstNumber} {question.operator} {question.secondNumber} = 
                </Typography>
                <TextField
                  type="number"
                  value={isNaN(answers[question.id]) ? '' : answers[question.id]}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  sx={{ 
                    width: '100px',
                    '& input': { 
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 500
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<CheckIcon />}
          onClick={handleSubmitClick}
          sx={{
            py: 1.5,
            px: 4,
            background: theme.palette.primary.main,
            '&:hover': {
              background: theme.palette.primary.dark,
            }
          }}
        >
          Tarkista vastaukset
        </Button>
      </Box>

      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Haluatko varmasti tarkistaa vastaukset?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Et ole vastannut kaikkiin tehtäviin ({questions.length - answeredCount} tehtävää vastaamatta). 
            Haluatko silti tarkistaa vastaukset?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowConfirmDialog(false)}
            variant="outlined"
          >
            Jatka vastaamista
          </Button>
          <Button 
            onClick={handleConfirmSubmit}
            variant="contained"
            color="primary"
            autoFocus
          >
            Tarkista vastaukset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
} 