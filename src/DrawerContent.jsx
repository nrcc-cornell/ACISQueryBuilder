import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import ExamplesList from './ExamplesList'
import ServerSelect from './ServerSelect'

const DrawerContent = (props) => { 
  
  return (
    <Drawer
        anchor="right"
        open={props.drawerStatus}
        PaperProps={{
          sx: {width: "50%"},
        }}
        onClose={()=>props.toggleDrawer(false)}
    >
      <Box sx={{textAlign:"left", p:"1em"}}>
        <ExamplesList 
          setWstype={props.setWstype}
          setInput_params_string={props.setInput_params_string}
          setInput_params={props.setInput_params}
          toggleDrawer={props.toggleDrawer}
          setGeneralArea={props.setGeneralArea}
          setResetElemsBuilder={props.setResetElemsBuilder}
        />
        <Divider />
        <Typography sx={{my:"1em"}}>
            <Link 
                variant="body2"
                href='https://www.rcc-acis.org/docs_webservices.html' 
                target="_blank" 
                rel="noopener" 
                onClick={()=>props.toggleDrawer(false)}
            >
                Go to full documentation
            </Link>
        </Typography>
        <Divider />
        <ServerSelect 
           updateServer={props.updateServer}
           toggleDrawer={props.toggleDrawer}
           server={props.server}
        />
      </Box>
    </Drawer>  
  )
}

export default DrawerContent