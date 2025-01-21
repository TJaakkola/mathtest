import { useState } from 'react'
import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Slider,
  RadioGroup,
  Radio,
  Paper
} from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'

// Theme constants
const THEME = {
  colors: {
    primaryMain: '#fb8c00',
    primaryDark: '#c25e00',
    primaryLight: '#ffbd45',
    backgroundAlpha: 'rgba(251, 140, 0, 0.03)',
    disabledGradientStart: '#bdbdbd',
    disabledGradientEnd: '#757575',
  },
  gradients: {
    button: {
      default: 'linear-gradient(135deg, #fb8c00, #c25e00)',
      hover: 'linear-gradient(135deg, #f57c00, #e65100)',
      disabled: 'linear-gradient(135deg, #bdbdbd, #757575)',
    }
  },
  effects: {
    thumbHoverShadow: '0 0 0 8px rgba(251, 140, 0, 0.16)',
  }
}

interface NumberRangeConfig {
  type: 'range' | 'specific'
  range: [number, number]
  specificNumbers: number[]
}

export interface TestParametersData {
  questionCount: number
  operators: string[]
  numberConfig: NumberRangeConfig
}

interface TestParametersProps {
  onSubmit: (parameters: TestParametersData) => void
}

const OPERATORS = [
  { value: '+', label: 'Yhteenlasku (+)' },
  { value: '-', label: 'Vähennyslasku (-)' },
  { value: '*', label: 'Kertolasku (×)' },
  { value: '/', label: 'Jakolasku (÷)' },
]

const QUESTION_COUNTS = [10, 20, 30, 40, 50]
const NUMBERS_1_10 = Array.from({ length: 10 }, (_, i) => i + 1)

export function TestParameters({ onSubmit }: TestParametersProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [parameters, setParameters] = useState<TestParametersData>({
    questionCount: 10,
    operators: ['+', '-'],
    numberConfig: {
      type: 'specific',
      range: [1, 10],
      specificNumbers: NUMBERS_1_10
    }
  })

  const handleOperatorChange = (operator: string) => {
    setParameters(prev => ({
      ...prev,
      operators: prev.operators.includes(operator)
        ? prev.operators.filter(op => op !== operator)
        : [...prev.operators, operator]
    }))
  }

  const handleRangeChange = (_event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[]
    setParameters(prev => ({
      ...prev,
      numberConfig: {
        ...prev.numberConfig,
        range: [min, max]
      }
    }))
  }

  const handleRangeTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setParameters(prev => ({
      ...prev,
      numberConfig: {
        ...prev.numberConfig,
        type: event.target.value as 'range' | 'specific'
      }
    }))
  }

  const handleSpecificNumberChange = (num: number) => {
    setParameters(prev => ({
      ...prev,
      numberConfig: {
        ...prev.numberConfig,
        specificNumbers: prev.numberConfig.specificNumbers.includes(num)
          ? prev.numberConfig.specificNumbers.filter(n => n !== num)
          : [...prev.numberConfig.specificNumbers, num]
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(parameters)
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.dark', fontWeight: 600 }}>
            Tehtävien määrä
          </Typography>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2,
              borderColor: 'primary.light',
              background: THEME.colors.backgroundAlpha
            }}
          >
            <RadioGroup
              row
              value={parameters.questionCount}
              onChange={(e) => setParameters(prev => ({
                ...prev,
                questionCount: parseInt(e.target.value)
              }))}
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              {QUESTION_COUNTS.map((count) => (
                <FormControlLabel
                  key={count}
                  value={count}
                  control={
                    <Radio 
                      sx={{
                        '&.Mui-checked': {
                          color: 'primary.main',
                        }
                      }}
                    />
                  }
                  label={count}
                  sx={{
                    flex: isMobile ? '1 0 40%' : 'auto',
                    m: 1,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '1.1rem',
                      fontWeight: parameters.questionCount === count ? 600 : 400,
                      color: parameters.questionCount === count ? 'primary.dark' : 'text.primary',
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.dark', fontWeight: 600 }}>
            Laskutoimitukset
          </Typography>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2,
              borderColor: 'primary.light',
              background: THEME.colors.backgroundAlpha
            }}
          >
            <FormGroup row={!isMobile}>
              {OPERATORS.map(({ value, label }) => (
                <FormControlLabel
                  key={value}
                  control={
                    <Checkbox
                      checked={parameters.operators.includes(value)}
                      onChange={() => handleOperatorChange(value)}
                      sx={{
                        '&.Mui-checked': {
                          color: 'primary.main',
                        }
                      }}
                    />
                  }
                  label={label}
                  sx={{ 
                    flex: isMobile ? '1 0 50%' : 'auto',
                    '& .MuiFormControlLabel-label': {
                      color: parameters.operators.includes(value) ? 'primary.dark' : 'text.primary',
                    }
                  }}
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.dark', fontWeight: 600 }}>
            Lukualue
          </Typography>
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2,
              borderColor: 'primary.light',
              background: THEME.colors.backgroundAlpha
            }}
          >
            <RadioGroup
              row
              value={parameters.numberConfig.type}
              onChange={handleRangeTypeChange}
              sx={{ 
                mb: 2,
                justifyContent: 'flex-start',
                gap: 4
              }}
            >
              <FormControlLabel
                value="specific"
                control={<Radio />}
                label="Luvut 1-10"
                sx={{
                  mr: 0
                }}
              />
              <FormControlLabel
                value="range"
                control={<Radio />}
                label="Valitse lukualue"
                sx={{
                  mr: 0
                }}
              />
            </RadioGroup>

            {parameters.numberConfig.type === 'range' ? (
              <Box>
                <Box sx={{ px: 2, pb: 2 }}>
                  <Slider
                    value={parameters.numberConfig.range}
                    onChange={handleRangeChange}
                    min={0}
                    max={100}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 25, label: '25' },
                      { value: 50, label: '50' },
                      { value: 75, label: '75' },
                      { value: 100, label: '100' }
                    ]}
                    sx={{
                      color: 'primary.main',
                      '& .MuiSlider-thumb': {
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: THEME.effects.thumbHoverShadow,
                        },
                      },
                      '& .MuiSlider-rail': {
                        opacity: 0.32,
                      },
                    }}
                  />
                </Box>
                <Typography variant="body1" align="center" sx={{ color: 'primary.dark' }}>
                  Alue: {parameters.numberConfig.range[0]} - {parameters.numberConfig.range[1]}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                gap: 1 
              }}>
                {NUMBERS_1_10.map(num => (
                  <FormControlLabel
                    key={num}
                    control={
                      <Checkbox
                        checked={parameters.numberConfig.specificNumbers.includes(num)}
                        onChange={() => handleSpecificNumberChange(num)}
                        sx={{
                          '&.Mui-checked': {
                            color: 'primary.main',
                          }
                        }}
                      />
                    }
                    label={num}
                    sx={{
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        color: parameters.numberConfig.specificNumbers.includes(num) 
                          ? 'primary.dark' 
                          : 'text.primary',
                      }
                    }}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            startIcon={<CreateIcon />}
            disabled={parameters.operators.length === 0}
            sx={{
              mt: 2,
              py: 1.5,
              background: THEME.gradients.button.default,
              '&:hover': {
                background: THEME.gradients.button.hover,
              },
              '&:disabled': {
                background: THEME.gradients.button.disabled,
              }
            }}
          >
            Luo tehtävät
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
} 