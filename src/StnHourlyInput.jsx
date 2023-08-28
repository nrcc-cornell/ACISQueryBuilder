import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import RenderTextField from './RenderTextField'
import DateSelection from './DateSelection'
import { buildElement, updateState, checkElemsError } from './builders.js'

const StnHourlyInput = (props) => { 
  const [ datastate, setDatastate] = useState ({
    sid: '',
    sdate: '',
    edate: '',
    date: '',
    elems: '',
    vX: '',
    vN: '',
    prec: '',
    meta: '',
  })
  const [ hasElemsError, setHasElemsError ] = useState(false)
  //const [ hasInterval, setHasInterval ] = useState(false) //NOT IMPLEMENTED YET
  const [ datetype, setDatetype ] = useState('pair')

  const datafields = ['sid','sdate','edate','date','elems','meta']
  const elementKeys = Object.keys(datastate).filter(
    item => (!datafields.includes(item)
  ))

  const updateParam = (update) => {
    setDatastate({...datastate, ...update})
    props.updateInputParams(update)
  }

  const updateElemBuild = (update) => {
    setDatastate({...datastate, ...update})
  }
  
  const addElement = (event) => {
    const action = event.currentTarget.id   //"add" or "replace"
    const newElems = JSON.stringify(buildElement(elementKeys, datastate, action))
    setDatastate({...datastate, ...{elems: newElems}})
    props.updateInputParams({elems: newElems})
    props.updateHelpFor("")
  }

  const clearElements = () => {
    setDatastate({...datastate, ...{elems: ''}})
    props.updateInputParams({elems: ""})
    props.updateHelpFor("")
    setHasElemsError(false)
  }

  const updateElems = (update) => {
    setDatastate({...datastate, ...update})
    const elemsError = checkElemsError(update.elems)
    setHasElemsError(elemsError)
    if (!elemsError) {
      props.updateInputParams(update)
    }
  }

  // Update local variable storage whenever input_params updates
  useEffect(() => {
    // to suppress unused checkHasIntervalStatus warning:
    // eslint-disable-next-line 
    const {newstate, checkHasIntervalStatus, checkElemsErrorStatus} = updateState(datafields, elementKeys, props.input_params, props.resetElemsBuilder)
    setDatastate({...datastate, ...newstate})
    //setHasInterval(checkHasIntervalStatus)  //NOT IMPLEMENTED YET
    setHasElemsError(checkElemsErrorStatus)
    props.setResetElemsBuilder(false)
    if (Object.keys(props.input_params).includes("date") && datetype === "pair") {
      setDatetype("single")
    } else if (Object.keys(props.input_params).includes("sdate") && datetype === "single") {
      setDatetype("pair")
    }
    // eslint-disable-next-line
  }, [props.input_params])

  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <Typography variant="h6">
            Required input
          </Typography>
          <RenderTextField
            id="sid"
            fieldlabel="Station ID"
            value={datastate.sid}
            updateHelpFor={() => props.updateHelpFor("hrly_sid")}
            updateParam={updateParam}
          />
          <DateSelection
            sdate={datastate.sdate}
            edate={datastate.edate}
            date={datastate.date}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateParam}
            datetype={datetype}
            setDatetype={setDatetype}
  
          />
          <RenderTextField
            id="elems"
            fieldlabel="Elements"
            value={datastate.elems}
            options={{
              width:0.9,
              multiline: true, 
              placeholder: "Enter directly or build using Element setup",
              error: hasElemsError,
              helperText: hasElemsError ? "Error in elements encoding" : "",
            }}
            updateHelpFor={() => props.updateHelpFor("hrly_elems")}
            updateParam={updateElems}
          />
          {datastate.elems.includes("{") &&
            <Button 
              size="small"
              variant="outlined"
              onMouseDown={clearElements}
            >
              Clear elements
            </Button>
          }
        </Grid>

        <Grid item xs={4}>
          <Typography variant="h6">
            Optional elements builder
          </Typography>
          <RenderTextField
            id="vX"
            fieldlabel="Var major"
            value={datastate.vX}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateElemBuild}
          />
          <RenderTextField
            id="vN"
            fieldlabel="Var minor"
            value={datastate.vN}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateElemBuild}
          />
          <RenderTextField
            id="prec"
            fieldlabel="Precision"
            value={datastate.prec}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateElemBuild}
          />

          {datastate.vX.length > 0 &&
            <Button
              id="add"
              size="small"
              variant="outlined"
              onMouseDown={addElement}
            >
              Add element
            </Button>
          }
          {datastate.vX.length > 0 && datastate.elems.includes("{") &&
            <Button 
              id="replace"
              size="small"
              variant="outlined"
              sx={{ml:1}}
              onMouseDown={addElement}
            >
              Replace elements
            </Button>
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
            options={{width:0.95}}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateParam}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default StnHourlyInput