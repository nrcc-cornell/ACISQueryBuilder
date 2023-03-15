import React, { useState, Fragment } from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ListSubheader from '@mui/material/ListSubheader'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { examples } from './examples'

const ExamplesList = (props) => {
  const [ exCategory, setExCategory ] = useState()
  const [ open, setOpen ] = useState({
    StnMeta: false,
    StnData: false,
    MultiStnData: false,
    GridData: false,
    GridData2: false,
    StnHourly: false,
    General: false,
  })

  const handleListClick = (wstype) => {
    let openChanges = {[wstype]:!open[wstype]}
    if (exCategory) {
      openChanges = {...{[exCategory]:false}, ...openChanges}
    }
    setOpen({...open, ...openChanges})
    setExCategory(wstype)
  }

  const handleExampleClick = (ex) => {
    const exparams = ex.params
    props.setWstype(exCategory)
    if (exCategory === 'General') {
      props.setGeneralArea(ex.generalArea)
    } else {
      props.setGeneralArea("")
    }
    props.setInput_params_string(exparams)
    const parsedString = JSON.parse(exparams)
    props.setInput_params(parsedString)
    props.toggleDrawer(false)
    props.setResetElemsBuilder(true)
  }

  return (
    <List
      subheader={
        <ListSubheader sx={{pl:0, fontSize:"100%"}}>
          Examples:
        </ListSubheader>
      }
    >
      {Object.keys(open).map((key) => (
        <Fragment key={key}>
          <ListItemButton sx={{pb:0}} onClick={() => handleListClick(key)}>
            <ListItemText 
              primary={key}
              secondary={open[key] ? " (click example to view)" : ""}
              primaryTypographyProps={{
                fontSize: 14,
                lineHeight: '8px',
                fontWeight: open[key] ? "bold" : "normal"
              }}
              secondaryTypographyProps={{
                padding: "3px 3px 0",
                fontStyle: "italic",
              }}
            />
            {open[key] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open[key]} timeout="auto" unmountOnExit>
            <List component="div">
              {examples[key].map((ex,i) => (
                <ListItemButton key={key+i} sx={{pl:3, py:0}} onClick={() => handleExampleClick(ex)}>
                  <ListItemText 
                    primary={(i+1)+". "+ex.title} 
                    primaryTypographyProps={{
                      fontSize: 14,
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </Fragment>
      ))}
    </List>
  )
}

export default ExamplesList