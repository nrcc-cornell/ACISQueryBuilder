import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import RenderTextField from './RenderTextField'
import DateSelection from './DateSelection'
import { buildElement, buildImage } from './Builders.jsx'

export default class GridData2Input extends Component { 
  constructor(props) {
    super(props)
    this.state = {
      loc: '',
      state: '',
      county: '',
      bbox: '',
      sdate: '',
      edate: '',
      date: '',
      grid: '',
      elems: '',
      elem: '',
      elem_string: '',
      name: '',
      base: '',
      interval: '',
      duration: '',
      season_start: '',
      reduce: '',
      maxmissing: '',
      area_reduce: '',
      elem_sdate: '',
      elem_edate: '',
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
      mapcontrols: '',
      haveInterval: false,
      includeImageControls: false,
    }
    this.datafields = ['loc','state','bbox','sdate','edate','date','grid','elems','meta','output','image']
    this.imagefields = ['info_only','proj','overlays','interp','cmap','width','height','levels']
    this.elementKeys = ["elem", "name", "base", "interval", "duration", "season_start", "reduce", "maxmissing", "area_reduce", "elem_sdate", "elem_edate"]
  }

  addElement = () => {
    const newElems = JSON.stringify(buildElement(this.elementKeys, this.state))
    this.setState({
      elems: newElems,
      haveInterval: true,
    })
    this.props.updateInputParams({elems: newElems})
  }

  nestElement = () => {
    const elem = buildElement(this.elementKeys, this.state)
    this.setState({
      elem: elem[0],
      elem_string: JSON.stringify(elem[0]),
      name: '',
      base: '',
      interval: '',
      duration: '',
      season_start: '',
      reduce: '',
      maxmissing: '',
      elem_sdate: '',
      elem_edate: '',
    })
  }

  clearElements = () => {
    this.setState({
      elems: '',
      haveInterval:false,
    })
    this.props.updateInputParams({elems: ""})
  }

  replaceElements = () => {
    this.setState({
      elems: ''
    }, this.addElement)
  }

  updateHelpFor = (helpFor) => {
    if (helpFor === 'meta') {
      helpFor = 'grid_meta'
    } else if (helpFor === 'output') {
      helpFor = 'grid2_output'
    } else if (helpFor === 'elems') {
      helpFor = 'grid2_elems'
    } else if (helpFor === 'name') {
      helpFor = 'grid2_name'
    } else if (helpFor === 'reduce') {
      helpFor = 'grid2_reduce'
    } else if (helpFor === 'grid') {
      helpFor = 'grid2'
    } else if (helpFor === 'bbox') {
      helpFor = 'grid2_bbox'
    } else if (helpFor === 'elem_sdate' || helpFor === 'elem_edate') {
      helpFor = 'date'
    }
    this.props.updateAppState({helpFor: helpFor})
  }
  
  updateParam = (update) => {
    this.setState(update)
    this.props.updateInputParams(update)
  }

  updateElems = (update) => {
    if (update.elems.length === 0) {
      this.setState({haveInterval: false})
    }
    this.updateParam(update)
  }

  updateElemBuild = (update) => {
    this.setState(update)
  }

  // images are currently disabled (this.state.includeImageControls: false)
  updateImage = (update) => {
    this.setState(update, () => {
      const image = buildImage(this.imagefields, this.state)
      this.updateParam({image: image})
    })
  }
 // images are currently disabled (this.state.includeImageControls: false)
  updateOutput = (update) => {
    if (update.output === 'image') {
      const image = buildImage(this.imagefields, this.state)
      this.updateParam({output:"image", image:image})
      this.setState({
        mapcontrols: true,
      })
    } else {
      this.updateParam(update)
    }
  }
 // images are currently disabled (this.state.includeImageControls: false)
  handleMapControlClick = event => {
    if (this.state.output !== 'image' || event.target.checked) {
      const image = event.target.checked ? buildImage(this.imagefields, this.state) : ""
      this.updateParam({image: image})
      this.setState({
        mapcontrols: event.target.checked, 
      })
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.state !== nextState) {
      return true
    } else if (this.props !== nextProps) {
      return this.datafields.some((key) => (nextProps.input_params.hasOwnProperty(key) && this.state[key] !== nextProps.input_params[key]) ||
            (!nextProps.input_params.hasOwnProperty(key) && this.state[key] !== ''))
    } else {
      return false
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.input_params !== prevProps.input_params) {
      this.datafields.forEach((key) => {
        if (this.props.input_params.hasOwnProperty(key) && this.state[key] !== this.props.input_params[key]) {
          if (key === 'elems' && typeof this.props.input_params.elems === 'object') {
            this.setState({[key]: JSON.stringify(this.props.input_params[key])})
          } else {
            this.setState({[key]: this.props.input_params[key]})
          }
        } else if (!this.props.input_params.hasOwnProperty(key) && this.state[key] !== '') {
          this.setState({[key]: ''})
        }
      })
    }
  }

  render () {
    const notdly = (this.state.duration.length === 3 && this.state.duration !== 'dly') || 
      (this.state.duration.length > 0 && !isNaN(Number(this.state.duration)) && 
      (this.state.duration !== "1" || (this.state.interval !== 'dly' && !(this.state.interval.includes('[') && this.state.interval.length === 7))))
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
              {this.state.state.length === 0 && 
               this.state.county.length === 0 && 
               this.state.bbox.length === 0 && 
                <RenderTextField
                  id="loc"
                  fieldlabel="Point location"
                  value={this.state.loc}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
              }
              {this.state.loc.length === 0 && 
               this.state.county.length === 0 && 
               this.state.bbox.length === 0 && 
                <RenderTextField
                  id="state"
                  fieldlabel="State"
                  value={this.state.state}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
              }
              {this.state.loc.length === 0 &&
               this.state.state.length === 0 && 
               this.state.bbox.length === 0 && 
               <RenderTextField
                  id="county"
                  fieldlabel="County"
                  value={this.state.county}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
              }
              {this.state.loc.length === 0 && 
               this.state.county.length === 0 && 
               this.state.state.length === 0 && 
                <RenderTextField
                  id="bbox"
                  fieldlabel="Bounding box"
                  value={this.state.bbox}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
              }
              <DateSelection
                sdate={this.state.sdate}
                edate={this.state.edate}
                date={this.state.date}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateParam}
              />
              <RenderTextField
                id="grid"
                fieldlabel="Grid id"
                value={this.state.grid}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateParam}
              />
              <RenderTextField
                id="elems"
                fieldlabel="Elements"
                value={this.state.elems}
                options={{style: {width:"90%"}, multiline: true, placeholder: "Build using Element setup"}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElems}
              />
              {this.state.elems.includes("{") &&
                <Button 
                  size="small"
                  variant="outlined"
                  style={{marginTop:"0.5em", backgroundColor:"lightcyan"}}
                  onMouseDown={this.clearElements}
                >
                  Clear elements
                </Button>
              }
            </Grid>

            <Grid item xs={4}>
              <Typography variant="h6">
                Element setup
              </Typography>
              {this.state.elem_string.length === 0 &&
                <RenderTextField
                  id="name"
                  fieldlabel="Name"
                  value={this.state.name}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }
              {this.state.elem_string.length > 0 &&
                <RenderTextField
                  id="elem"
                  fieldlabel="Elem"
                  value={this.state.elem_string}
                  options={{style: {width:"90%"}, multiline: true}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }
              {this.state.name.includes("dd") &&
                <RenderTextField
                  id="base"
                  fieldlabel="Base"
                  value={this.state.base}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }
              <RenderTextField
                id="interval"
                fieldlabel="Interval"
                value={this.state.interval}
                options={{disabled:this.state.haveInterval}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElemBuild}
              />
              <RenderTextField
                id="duration"
                fieldlabel="Duration"
                value={this.state.duration}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElemBuild}
              />
              {this.state.duration === 'std' &&
                <RenderTextField
                  id="season_start"
                  fieldlabel="Season start"
                  value={this.state.season_start}
                  options={{required:true}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }
              {notdly &&
                <RenderTextField
                  id="reduce"
                  fieldlabel="Reduce"
                  value={this.state.reduce}
                  options={{required:true}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }
              {notdly &&
                <RenderTextField
                  id="maxmissing"
                  fieldlabel="Max missing"
                  value={this.state.maxmissing}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }
              <RenderTextField
                id="elem_sdate"
                fieldlabel="Start date"
                value={this.state.elem_sdate}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElemBuild}
              />
              <RenderTextField
                id="elem_edate"
                fieldlabel="End date"
                value={this.state.elem_edate}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElemBuild}
              />
              {(this.state.loc.length === 0 && this.state.county.length === 0) && 
                <RenderTextField
                  id="area_reduce"
                  fieldlabel="Area reduction"
                  value={this.state.area_reduce}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }

              {(this.state.name.length > 0 || this.state.elem_string.length > 0) &&
                <div>
                  <Button 
                    size="small"
                    variant="outlined"
                    style={{marginTop:"0.5em", backgroundColor:"lightcyan"}}
                    onMouseDown={this.nestElement}
                  >
                    Nest
                  </Button>
                  <Button 
                    size="small"
                    variant="outlined"
                    style={{marginTop:"0.5em", marginLeft:"1em", backgroundColor:"lightcyan"}}
                    onMouseDown={this.addElement}
                  >
                    Add
                  </Button>
                </div>
              }
              {this.state.name.length > 0 && this.state.elems.includes("{") &&
                <Button 
                  size="small"
                  variant="outlined"
                  style={{marginTop:"0.5em", backgroundColor:"lightcyan"}}
                  onMouseDown={this.replaceElements}
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
                value={this.state.meta}
                options={{style: {width:"95%"}}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateParam}
              />
              <RenderTextField
                id="output"
                fieldlabel="Output type"
                value={this.state.output}
                options={{disabled: this.state.meta.length && this.state.output === 'json' ? true : false}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateParam}
              />
              {this.state.includeImageControls &&
                <div>
                  <FormControlLabel
                    control={
                      <Switch
                        value={this.state.mapcontrols}
                        onChange={this.handleMapControlClick}
                        checked={this.state.mapcontrols}
                        color="primary"
                      />
                    }
                    label="Map settings"
                  />
                  {this.state.mapcontrols &&
                    <div>
                      {this.state.output !== 'image' &&
                        <RenderTextField
                          id="info_only"
                          fieldlabel="Info only"
                          value={this.state.info_only}
                          options={{style: {marginLeft:"2em"}}}
                          updateHelpFor={this.updateHelpFor}
                          updateParam={this.updateImage}
                        />
                      }
                      <RenderTextField
                        id="proj"
                        fieldlabel="Proj"
                        value={this.state.proj}
                        options={{style: {marginLeft:"2em"}}}
                        updateHelpFor={this.updateHelpFor}
                        updateParam={this.updateImage}
                      />
                      <RenderTextField
                        id="overlays"
                        fieldlabel="Overlays"
                        value={this.state.overlays}
                        options={{style: {marginLeft:"2em"}}}
                        updateHelpFor={this.updateHelpFor}
                        updateParam={this.updateImage}
                      />
                      <RenderTextField
                        id="interp"
                        fieldlabel="Interp"
                        value={this.state.interp}
                        options={{style: {marginLeft:"2em"}}}
                        updateHelpFor={this.updateHelpFor}
                        updateParam={this.updateImage}
                      />
                      <RenderTextField
                        id="cmap"
                        fieldlabel="Cmap"
                        value={this.state.cmap}
                        options={{style: {marginLeft:"2em"}}}
                        updateHelpFor={this.updateHelpFor}
                        updateParam={this.updateImage}
                      />
                      {this.state.height.length === 0 &&
                        <RenderTextField
                          id="width"
                          fieldlabel="Width"
                          value={this.state.width}
                          options={{style: {marginLeft:"2em"}, required: this.state.mapcontrols}}
                          updateHelpFor={this.updateHelpFor}
                          updateParam={this.updateImage}
                        />
                      }
                      {this.state.width.length === 0 &&
                        <RenderTextField
                          id="height"
                          fieldlabel="Height"
                          value={this.state.height}
                          options={{style: {marginLeft:"2em"}, required: this.state.mapcontrols}}
                          updateHelpFor={this.updateHelpFor}
                          updateParam={this.updateImage}
                        />
                      }
                      <RenderTextField
                        id="levels"
                        fieldlabel="Levels"
                        value={this.state.levels}
                        options={{style: {marginLeft:"2em"}}}
                        updateHelpFor={this.updateHelpFor}
                        updateParam={this.updateImage}
                      />
                    </div>
                  }
                </div>
              }
            </Grid>
          </Grid>
      </div>
    )
  }
}
