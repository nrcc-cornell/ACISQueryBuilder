import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

const ResultsButtons = (props) => {
  const buttonLabels = ['JSON', 'Basic format', 'Full format']

  return (
    <Box sx={{my:"0.5em"}}>
      <Grid container spacing={4}>
        <Grid item>
          <Typography variant="h6">
            Results:
          </Typography>
        </Grid>
        <Grid item>
          {props.showButtons &&
            <ToggleButtonGroup 
              value={props.selectedButton} 
              exclusive 
              onChange={e => props.handleFormat(e.target.value)}
            >
              {buttonLabels.map((item) => (
                <ToggleButton 
                  key={item} 
                  value={item}
                >
                  {item}
                </ToggleButton>                  
              ))}
            </ToggleButtonGroup>
          }
        </Grid>
      </Grid>
    </Box>
  )
}

export default ResultsButtons