import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import RenderTextField from './RenderTextField'

const GeneralInput = (props) => { 
  const [ datastate, setDatastate ] = useState({
    state: '',
    bbox: '',
    id: '',
    meta: '',
  })
  const [ generalArea, setGeneralArea ] = useState("state")
  const paramfields = Object.keys(datastate)

  const updateParam = (update) => {
    setDatastate({...datastate, ...update})
    props.updateInputParams(update)
  }
  
  const updateArea = (event) => {
    setGeneralArea(event.target.value)
    props.updateGeneralArea(event.target.value)
  }

  useEffect(() => {
    let newstate = {}
    paramfields.forEach((key) => {
      if (props.input_params.hasOwnProperty(key)) {
        newstate = ({...newstate, ...{[key]: props.input_params[key]}})
      } else {
        newstate = ({...newstate, ...{[key]: ''}})
      }
    })
    setDatastate(newstate)
    // eslint-disable-next-line
  }, [props.input_params])

  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <Typography variant="h6">
            Required input
          </Typography>

          <TextField
            id="general_area"
            select
            label="Area"
            value={generalArea}
            onChange={updateArea}
            onFocus={() => props.updateHelpFor("general_area")}
            onBlur={() => props.updateHelpFor(null)}
            margin="dense"
            variant="outlined"
            size="small"
          >
            <MenuItem sx={{fontSize:"90%"}} value={'state'}>state</MenuItem>
            <MenuItem sx={{fontSize:"90%"}} value={'county'}>county</MenuItem>
            <MenuItem sx={{fontSize:"90%"}} value={'climdiv'}>climdiv</MenuItem>
            <MenuItem sx={{fontSize:"90%"}} value={'cwa'}>cwa</MenuItem>
            <MenuItem sx={{fontSize:"90%"}} value={'basin'}>basin</MenuItem>
          </TextField>
          <br />
          <Typography variant="caption">
            Enter one of the following:
          </Typography>
          {datastate.id.length === 0 && datastate.bbox.length === 0 &&
            <RenderTextField
              id="state"
              fieldlabel="State"
              value={datastate.state}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          {datastate.state.length === 0 && datastate.bbox.length === 0 &&
            <RenderTextField
              id="id"
              fieldlabel="ID"
              value={datastate.id}
              updateHelpFor={() => props.updateHelpFor("general_id")}
              updateParam={updateParam}
            />
          }
          {datastate.state.length === 0 && datastate.id.length === 0 &&
            <RenderTextField
              id="bbox"
              fieldlabel="Bounding box"
              value={datastate.bbox}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
        </Grid>

        <Grid item xs={4}>
          <Typography variant="h6">
            Optional input
          </Typography>
          <RenderTextField
            id="meta"
            fieldlabel="Meta options"
            value={datastate.meta}
            updateHelpFor={() => props.updateHelpFor("general_meta")}
            updateParam={updateParam}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default GeneralInput
