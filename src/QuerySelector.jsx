import React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import { acisServers } from './acisServers'

const QuerySelector = (props) => {
  const query_types = Object.keys(acisServers)

  const handleChange = (event, value) => {
    if (value) {
      props.handleChange(value)
    }
  }

  return (
    <Box sx={{mb:"1em"}}>
      <Grid container spacing={0} direction="row" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h5">
            ACIS Query Builder
          </Typography>
        </Grid>
        <Grid item>
          <ToggleButtonGroup 
            value={props.wstype} 
            exclusive 
            onChange={handleChange}
          >
            {query_types.map((item) => (
              <ToggleButton 
                key={item} 
                value={item}
              >
                {item}
              </ToggleButton>                  
            ))}
          </ToggleButtonGroup>
        </Grid>
        <Grid>
          <Tooltip title="More information">
            <IconButton onClick={()=>props.toggleDrawer(true)} size="small">
              <MoreHoriz fontSize="small" sx={{color:"blue"}} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  )
}

export default QuerySelector