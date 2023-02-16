import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { buildExplanation } from './builders.js'

const QueryExplain = (props) => {
  const  [ exptext, setExptext ] = useState("")

  useEffect(() => {
    const exptext = buildExplanation(props.input_params)
    setExptext(exptext)
  }, [props.input_params])

  return (
    <Box sx={{mt:"0.5em"}}>
      {exptext &&
        <Paper 
          elevation={1} 
          variant="explainPaper"
        >
          <Typography variant="body2" sx={{fontWeight:"bold"}}>
            Expected return:
          </Typography>
          <Typography sx={{fontSize:"80%"}}>
            {exptext}
          </Typography>
        </Paper>
      }
    </Box>
  )
}

export default QueryExplain