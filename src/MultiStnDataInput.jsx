import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import RenderTextField from './RenderTextField'
import DateSelection from './DateSelection'
import QueryExplain from './QueryExplain'
import { buildElement, checkHasInterval, checkElemsError } from './builders.js'

const MultiStnDataInput = (props) => { 

  const [ datastate, setDatastate ] = useState({
    sids: '',
    county: '',
    climdiv: '',
    cwa: '',
    basin: '',
    state: '',
    bbox: '',
    sdate: '',
    edate: '',
    date: '',
    elems: '',
    name: '',
    base: '',
    interval: '',
    duration: '',
    season_start: '',
    add: '',
    reduce: '',
    reduce_add: '',
    reduce_n: '',
    reduce_run_maxmissing: '',
    maxmissing: '',
    smry: '',
    smry_add: '',
    smry_n: '',
    smry_run_maxmissing: '',
    smry_only: '',
    normal: '',
    groupby: '',
    prec: '',
    meta: '',
    output: '',
    network: '',
  })
  const [ notdly, setNotdly ] = useState(false)
  const [ hasInterval, setHasInterval ] = useState(false)
  const [ hasElemsError, setHasElemsError ] = useState(false)

  const datafields = ['sids','county','climdiv','cwa','basin','state','bbox','sdate','edate','date','elems','meta','output']
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
    setHasInterval(false)
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
    let newstate= {}
    datafields.forEach((key) => {
      if (props.input_params.hasOwnProperty(key)) {
        if (key === 'elems' && typeof props.input_params.elems === 'object') {
          const strelems = JSON.stringify(props.input_params.elems)
          newstate= ({...newstate, ...{[key]: strelems}})
          setHasInterval(checkHasInterval({[key]: strelems}))
          setHasElemsError(checkElemsError(strelems))
        } else {
          newstate= ({...newstate, ...{[key]: props.input_params[key]}})
        }
      } else {
        newstate = ({...newstate, ...{[key]: ''}})
      }
    })
    setDatastate({...datastate, ...newstate})
    // eslint-disable-next-line
  }, [props.input_params])

  // Check for change to notdly whenever duration or interval changes
  useEffect(() => {
    if (datastate.duration) {
      setNotdly((datastate.duration.length === 3 && datastate.duration !== 'dly') || 
        (datastate.duration.length > 0 && !isNaN(Number(datastate.duration)) && 
        (datastate.duration !== "1" || (datastate.interval !== 'dly' && !(datastate.interval.includes('[') && datastate.interval.length === 7)))))
    }
  }, [datastate.duration, datastate.interval])

  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <Typography variant="h6">
            Required input
          </Typography>
          <Typography variant="caption">
            Enter id(s) for one of the following area types:
          </Typography>
          {datastate.cwa.length === 0 &&
           datastate.county.length === 0 &&              
           datastate.sids.length === 0 &&
           datastate.bbox.length === 0 &&
            <RenderTextField
              id="state"
              fieldlabel="State"
              value={datastate.state}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          {datastate.sids.length === 0 && 
           datastate.climdiv.length === 0 && 
           datastate.cwa.length === 0 && 
           datastate.basin.length === 0 && 
           datastate.state.length === 0 &&
           datastate.bbox.length === 0 &&
            <RenderTextField
              id="county"
              fieldlabel="County"
              value={datastate.county}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          {datastate.county.length === 0 && 
           datastate.sids.length === 0 && 
           datastate.cwa.length === 0 && 
           datastate.basin.length === 0 && 
           datastate.bbox.length === 0 &&
            <RenderTextField
              id="climdiv"
              fieldlabel="Climate Division"
              value={datastate.climdiv}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          {datastate.county.length === 0 && 
           datastate.climdiv.length === 0 && 
           datastate.sids.length === 0 && 
           datastate.basin.length === 0 && 
           datastate.bbox.length === 0 &&
            <RenderTextField
              id="cwa"
              fieldlabel="CWA"
              value={datastate.cwa}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          {datastate.county.length === 0 && 
           datastate.climdiv.length === 0 && 
           datastate.cwa.length === 0 && 
           datastate.sids.length === 0 && 
           datastate.bbox.length === 0 &&
            <RenderTextField
              id="basin"
              fieldlabel="Basin"
              value={datastate.basin}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          {datastate.county.length === 0 && 
           datastate.climdiv.length === 0 && 
           datastate.cwa.length === 0 && 
           datastate.basin.length === 0 && 
           datastate.state.length === 0 &&
           datastate.sids.length === 0 &&
            <RenderTextField
              id="bbox"
              fieldlabel="Bounding box"
              value={datastate.bbox}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          {datastate.county.length === 0 && 
           datastate.climdiv.length === 0 && 
           datastate.cwa.length === 0 && 
           datastate.basin.length === 0 && 
           datastate.state.length === 0 &&
           datastate.bbox.length === 0 &&
            <RenderTextField
              id="sids"
              fieldlabel="Station IDs"
              value={datastate.sids}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          <DateSelection
            sdate={datastate.sdate}
            edate={datastate.edate}
            date={datastate.date}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateParam}
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
              helperText: hasElemsError ? "Error in elements encoding" : ""}}
            updateHelpFor={props.updateHelpFor}
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
          <QueryExplain
            input_params={props.input_params}
            wstype="StnData"
          />
        </Grid>

        <Grid item xs={4}>
          <Typography variant="h6">
            Optional elements builder
          </Typography>
          <RenderTextField
            id="name"
            fieldlabel="Name"
            value={datastate.name}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateElemBuild}
          />
          {datastate.name.includes("dd") &&
            <RenderTextField
              id="base"
              fieldlabel="Base"
              value={datastate.base}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateElemBuild}
            />
          }
          <RenderTextField
            id="interval"
            fieldlabel="Interval"
            value={datastate.interval}
            options={{disabled:hasInterval}}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateElemBuild}
          />
          <RenderTextField
            id="duration"
            fieldlabel="Duration"
            value={datastate.duration}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateElemBuild}
          />
          {datastate.duration === 'std' &&
            <RenderTextField
              id="season_start"
              fieldlabel="Season start"
              value={datastate.season_start}
              options={{required:true}}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateElemBuild}
            />
          }
          {!notdly &&
            <RenderTextField
              id="add"
              fieldlabel="Add"
              value={datastate.add}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateElemBuild}
            />
          }
          <RenderTextField
            id="reduce"
            fieldlabel="Reduce"
            value={datastate.reduce}
            options={{required:notdly}}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateElemBuild}
          />
          {datastate.reduce.length > 0 && 
            <Box sx={{ml:1.5}}>
              <RenderTextField
                id="reduce_add"
                fieldlabel="- Reduce Add"
                value={datastate.reduce_add}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateElemBuild}
              />
              <RenderTextField
                id="reduce_n"
                fieldlabel="- Reduce Number"
                value={datastate.reduce_n}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateElemBuild}
              />
              {datastate.reduce.includes("run") &&
                <RenderTextField
                  id="reduce_run_maxmissing"
                  fieldlabel="- Run max missing"
                  value={datastate.reduce_run_maxmissing}
                  updateHelpFor={props.updateHelpFor}
                  updateParam={updateElemBuild}
                />
              }
            </Box>
          }
          {notdly &&
            <RenderTextField
              id="maxmissing"
              fieldlabel="Max missing"
              value={datastate.maxmissing}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateElemBuild}
            />
          }
          <RenderTextField
            id="smry"
            fieldlabel="Summary"
            value={datastate.smry}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateElemBuild}
          />
          {datastate.smry.length > 0 &&
            <>
            <Box sx={{ml:1.5}}>
              <RenderTextField
                id="smry_add"
                fieldlabel="- Smry Add"
                value={datastate.smry_add}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateElemBuild}
              />
              <RenderTextField
                id="smry_n"
                fieldlabel="- Smry Number"
                value={datastate.smry_n}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateElemBuild}
              />
              {datastate.smry.includes('run') &&
                <RenderTextField
                  id="smry_run_maxmissing"
                  fieldlabel="- Smry Max missing"
                  value={datastate.smry_run_maxmissing}
                  updateHelpFor={props.updateHelpFor}
                  updateParam={updateElemBuild}
                />
              }
            </Box>
            <RenderTextField
              id="smry_only"
              fieldlabel="Summary only"
              value={datastate.smry_only}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateElemBuild}
            />
            </>
          }
          <RenderTextField
            id="normal"
            fieldlabel="Normal"
            value={datastate.normal}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateElemBuild}
          />
          {datastate.interval !== 'yly' &&
            <RenderTextField
              id="groupby"
              fieldlabel="Group by"
              value={datastate.groupby}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateElemBuild}
            />
          }
          <RenderTextField
            id="prec"
            fieldlabel="Precision"
            value={datastate.prec}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateElemBuild}
          />

          {datastate.name.length > 0 &&
            <Button 
              id="add"
              size="small"
              variant="outlined"
              onMouseDown={addElement}
            >
              Add element
            </Button>
          }
          {datastate.name.length > 0 && datastate.elems.includes("{") &&
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
          <RenderTextField
            id="output"
            fieldlabel="Output type"
            value={datastate.output}
            options={{disabled: datastate.meta.length && datastate.output === 'json' ? true : false}}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateParam}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default MultiStnDataInput