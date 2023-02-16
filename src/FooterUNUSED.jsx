import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'

const Footer = (props) => { 
  const options = ['Any','NRCC','HPRCC'] //removed SRCC and added AWS1 -kle 2021-5-4; removed AWS1 -kle 2022-1-27

  const [ anchorEl, setAnchorEl ] = useState(null)

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget)
  }
  
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleMenuSelect = (server) => {
    setAnchorEl(null)
    props.updateServer(server)
  }
  
  return (
    <footer>
      <Grid container sx={{pl:"0.5em", pr:"0.5em"}}>
        <Grid item xs={6}>
          <Button 
            variant="verysmall" 
            size="small" 
            onClick={handleOpenMenu}
          >
            Select Specific Server {props.server !== 'Any' && 
              "(" + props.server + ")"
            }
          </Button>
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleCloseMenu}
          >
            {options.map(option => (
              <MenuItem
              variant="verysmall"
                key={option}
                selected={option === props.server}
                onClick={() => handleMenuSelect(option)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu> 
        </Grid>

        <Grid item xs={6} sx={{textAlign:"right"}}>
          <Typography align="right" color="primary" variant="caption">
            <a href='https://www.rcc-acis.org/docs_webservices.html' target="blank">Full documentation</a>
          </Typography>
        </Grid>
      </Grid>
    </footer>
  )
}

export default Footer