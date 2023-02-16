import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import RenderTextField from './RenderTextField'
import DateSelection from './DateSelection'
import QueryExplain from './QueryExplain'
import { buildElement, buildImage, checkHasInterval, checkElemsError } from './builders.js'

const GridDataInput = (props) => { 
  const [ datastate, setDatastate] = useState({
    loc: '',
    state: '',
    bbox: '',
    sdate: '',
    edate: '',
    date: '',
    grid: '',
    elems: '',
    name: '',
    base: '',
    interval: '',
    duration: '',
    season_start: '',
    reduce: '',
    maxmissing: '',
    smry: '',
    smry_only: '',
    area_reduce: '',
    prec: '',
    units: '',
    meta: '',
    output: '',
    image: '',
    info_only: '',
    proj: '',
    overlays: '',
    interp: '',
    cmap: '',
    width: '',
    height: '',
    levels: '',
  })

  const [ notdly, setNotdly ] = useState(false)
  const [ hasInterval, setHasInterval ] = useState(false)
  const [ hasElemsError, setHasElemsError ] = useState(false)
  const [ mapcontrols, setMapcontrols ] = useState(false)
  
  const datafields = ['loc','state','bbox','sdate','edate','date','grid','elems','meta','output','image']
  const imagefields = ['info_only','proj','overlays','interp','cmap','width','height','levels']
  const elementKeys = Object.keys(datastate).filter(
    item => (![...datafields, ...imagefields].includes(item)
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

  const updateImage = (update) => {
    const updatedstate = {...datastate, ...update}
    setDatastate(updatedstate)
    const image = buildImage(imagefields, updatedstate)
    props.updateInputParams({image: image})
  }

  const updateOutput = (update) => {
    if (update.output === 'image') {
      const image = buildImage(imagefields, datastate)
      updateParam({output:"image", image:image})
      setMapcontrols(true)
    } else {
      updateParam(update)
    }
  }
  
  const handleMapControlClick = event => {
    if (datastate.output !== 'image' || event.target.checked) {
      const image = event.target.checked ? buildImage(imagefields, datastate) : ""
      updateParam({image: image})
      setMapcontrols(event.target.checked)
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
            Enter information for one of the grid selection types:
          </Typography>
          {datastate.state.length === 0 && 
            datastate.bbox.length === 0 && 
            <RenderTextField
              id="loc"
              fieldlabel="Point location"
              value={datastate.loc}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          {datastate.loc.length === 0 && 
            datastate.bbox.length === 0 && 
            <RenderTextField
              id="state"
              fieldlabel="State"
              value={datastate.state}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          {datastate.loc.length === 0 && 
            datastate.state.length === 0 && 
            <RenderTextField
              id="bbox"
              fieldlabel="Bounding box"
              value={datastate.bbox}
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
            id="grid"
            fieldlabel="Grid id"
            value={datastate.grid}
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
              helperText: hasElemsError ? "Error in elements encoding" : "",
            }}
            updateHelpFor={() => props.updateHelpFor("grid_elems")}
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
            wstype="GridData"
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
            updateHelpFor={() => props.updateHelpFor("grid_elems")}
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
          <RenderTextField
            id="reduce"
            fieldlabel="Reduce"
            value={datastate.reduce}
            options={{required:notdly}}
            updateHelpFor={() => props.updateHelpFor("grid_reduce")}
            updateParam={updateElemBuild}
          />
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
            <RenderTextField
              id="smry_only"
              fieldlabel="Summary only"
              value={datastate.smry_only}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateElemBuild}
            />
          }
          <RenderTextField
            id="units"
            fieldlabel="Units"
            value={datastate.units}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateElemBuild}
          />
          {datastate.loc.length === 0 &&  
            <RenderTextField
              id="area_reduce"
              fieldlabel="Area reduction"
              value={datastate.area_reduce}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateElemBuild}
            />
          }

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
            updateHelpFor={() => props.updateHelpFor("grid_meta")}
            updateParam={updateParam}
          />
          <RenderTextField
            id="output"
            fieldlabel="Output type"
            value={datastate.output}
            options={{disabled: datastate.meta.length && datastate.output === 'json' ? true : false}}
            updateHelpFor={() => props.updateHelpFor("grid_output")}
            updateParam={updateOutput}
          />
          <FormControlLabel
            control={
              <Switch
                value={mapcontrols}
                onChange={handleMapControlClick}
                checked={mapcontrols}
              />
            }
            label="Map settings"
          />
          {mapcontrols &&
            <Box sx={{pl:"1em"}}>
              {datastate.output !== 'image' &&
                <RenderTextField
                  id="info_only"
                  fieldlabel="Info only"
                  value={datastate.info_only}
                  updateHelpFor={props.updateHelpFor}
                  updateParam={updateImage}
                />
              }
              <RenderTextField
                id="proj"
                fieldlabel="Proj"
                value={datastate.proj}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateImage}
              />
              <RenderTextField
                id="overlays"
                fieldlabel="Overlays"
                value={datastate.overlays}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateImage}
              />
              <RenderTextField
                id="interp"
                fieldlabel="Interp"
                value={datastate.interp}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateImage}
              />
              <RenderTextField
                id="cmap"
                fieldlabel="Cmap"
                value={datastate.cmap}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateImage}
              />
              {datastate.height.length === 0 &&
                <RenderTextField
                  id="width"
                  fieldlabel="Width"
                  value={datastate.width}
                  options={{equired: mapcontrols}}
                  updateHelpFor={props.updateHelpFor}
                  updateParam={updateImage}
                />
              }
              {datastate.width.length === 0 &&
                <RenderTextField
                  id="height"
                  fieldlabel="Height"
                  value={datastate.height}
                  options={{required: mapcontrols}}
                  updateHelpFor={props.updateHelpFor}
                  updateParam={updateImage}
                />
              }
              <RenderTextField
                id="levels"
                fieldlabel="Levels"
                value={datastate.levels}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateImage}
              />
            </Box>
          }
        </Grid>
      </Grid>
    </div>
  )
}

export default GridDataInput