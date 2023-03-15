import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const ServerSelect = (props) => {
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
    <>
      <Button 
        variant="verysmall" 
        sx={{my:"1em"}}
        onClick={handleOpenMenu}
      >
        Select Specific Server {props.server !== 'Any' && "("+props.server+")"}
      </Button>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
      >
        {options.map(option => (
          <MenuItem
            key={option}
            selected={option === props.server}
            onClick={() => handleMenuSelect(option)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu> 
    </>
  )
}

export default ServerSelect
