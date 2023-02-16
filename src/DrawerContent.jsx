import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Drawer from '@mui/material/Drawer'

const DrawerContent = (props) => { 
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
    props.toggleDrawer(false)
  }
  
  return (
    <Drawer
        anchor="right"
        open={props.drawerStatus}
        onClose={()=>props.toggleDrawer(false)}
    >
      <Box sx={{textAlign:"center", p:"1em"}}>
        <Typography sx={{mb:"1em"}}>
            <Link 
                variant="body2"
                href='https://www.rcc-acis.org/docs_webservices.html' 
                target="_blank" 
                rel="noopener" 
                onClick={()=>props.toggleDrawer(false)}
            >
                Visit full documentation
            </Link>
        </Typography>
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
      </Box>
    </Drawer>  
  )
}

export default DrawerContent