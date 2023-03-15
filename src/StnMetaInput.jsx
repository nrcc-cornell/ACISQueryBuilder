import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import RenderTextField from './RenderTextField'
import DateSelection from './DateSelection'

const StnMetaInput = (props) => { 
  const [metastate, setMetastate] = useState({
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
    meta: '',
    elems: '',
    output: '',
    network: '',
  })
  const [ datetype, setDatetype ] = useState('pair')
 
  const updateParam = (update) => {
    setMetastate({...metastate, ...update})
    props.updateInputParams(update)
  }

  useEffect(() => {
    let newmeta = {}
    Object.keys(metastate).forEach((key) => {
      if (props.input_params.hasOwnProperty(key)) {
        newmeta = ({...newmeta, ...{[key]: props.input_params[key]}})
      } else {
        newmeta = ({...newmeta, ...{[key]: ''}})
      }
    })
    if (Object.keys(props.input_params).includes("date") && datetype === "pair") {
      setDatetype("single")
    } else if (Object.keys(props.input_params).includes("sdate") && datetype === "single") {
      setDatetype("pair")
    }
    setMetastate(newmeta)
    // eslint-disable-next-line
  }, [props.input_params])

  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <Typography variant="h6">
            Required input
          </Typography>
          <Typography variant="caption">
            Enter at least one of the following:
          </Typography>
          {metastate.county.length === 0 && 
            metastate.climdiv.length === 0 && 
            metastate.cwa.length === 0 && 
            metastate.basin.length === 0 && 
            metastate.state.length === 0 &&
            metastate.bbox.length === 0 &&
            <RenderTextField
              id="sids"
              fieldlabel="Station ID(s)"
              value={metastate.sids}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          {metastate.sids.length === 0 &&
            <div>
              <RenderTextField
                id="state"
                fieldlabel="State"
                value={metastate.state}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateParam}
              />
              <RenderTextField
                id="county"
                fieldlabel="County"
                value={metastate.county}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateParam}
              />
              <RenderTextField
                id="climdiv"
                fieldlabel="Climate Division"
                value={metastate.climdiv}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateParam}
              />
              <RenderTextField
                id="cwa"
                fieldlabel="CWA"
                value={metastate.cwa}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateParam}
              />
              <RenderTextField
                id="basin"
                fieldlabel="Basin"
                value={metastate.basin}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateParam}
              />
              <RenderTextField
                id="bbox"
                fieldlabel="Bounding box"
                value={metastate.bbox}
                updateHelpFor={props.updateHelpFor}
                updateParam={updateParam}
              />
            </div>
          }
        </Grid>

        <Grid item xs={4}>
          <Typography variant="h6">
            Optional input
          </Typography>
          <Typography variant="caption">
            Enter any or all of the following:
          </Typography>
          <RenderTextField
            id="meta"
            fieldlabel="Meta options"
            value={metastate.meta}
            options={{width:0.95}}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateParam}
          />
          {(metastate.sids.length === 0 || metastate.meta.includes('valid_daterange')) &&
            <RenderTextField
              id="elems"
              fieldlabel="Elements"
              value={metastate.elems}
              options={{required: metastate.meta.includes('valid_daterange') ? true : false}}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
            />
          }
          <RenderTextField
            id="output"
            fieldlabel="Output type"
            value={metastate.output}
            options={{disabled: metastate.meta.length && metastate.output === 'json' ? true : false}}
            updateHelpFor={props.updateHelpFor}
            updateParam={updateParam}
          />

          {metastate.sids.length === 0 &&
            <DateSelection
              sdate={metastate.sdate}
              edate={metastate.edate}
              date={metastate.date}
              updateHelpFor={props.updateHelpFor}
              updateParam={updateParam}
              datetype={datetype}
              setDatetype={setDatetype}
            />
          }
        </Grid>
      </Grid>
    </div>
  )
}

export default StnMetaInput