import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import RenderTextField from './RenderTextField'
import DateSelection from './DateSelection'
import QueryExplain from './QueryExplain'
import { buildElement } from './Builders.jsx'

export default class MultiStnDataInput extends Component { 
  constructor(props) {
    super(props)
    this.state = {
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
      haveInterval: false,
      network: '',
    }
    this.datafields = ['sids','county','climdiv','cwa','basin','state','bbox','sdate','edate','date','elems','meta','output']
    this.elementKays = Object.keys(this.state).filter(
      item => (!["haveInterval",...this.datafields].includes(item)
    ))
  }

  addElement = () => {
    const newElems = JSON.stringify(buildElement(this.elementKays, this.state))
    this.setState({
      elems: newElems,
      haveInterval: true,
    })
    this.props.updateInputParams({elems: newElems})
}

  clearElements = () => {
    this.setState({
      elems: '',
      haveInterval: false,
    })
    this.props.updateInputParams({elems: ""})
  }

  replaceElements = () => {
    this.setState({
      elems: ''
    }, this.addElement)
  }

  updateHelpFor = (helpFor) => {
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
                Enter id(s) for one of the following area types:
              </Typography>
              {this.state.county.length === 0 &&                
               this.state.sids.length === 0 &&
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
              {this.state.sids.length === 0 && 
               this.state.climdiv.length === 0 && 
               this.state.cwa.length === 0 && 
               this.state.basin.length === 0 && 
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
              {this.state.county.length === 0 && 
               this.state.sids.length === 0 && 
               this.state.cwa.length === 0 && 
               this.state.basin.length === 0 && 
               this.state.bbox.length === 0 &&
                <RenderTextField
                  id="climdiv"
                  fieldlabel="Climate Division"
                  value={this.state.climdiv}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
              }
              {this.state.county.length === 0 && 
               this.state.climdiv.length === 0 && 
               this.state.sids.length === 0 && 
               this.state.basin.length === 0 && 
               this.state.bbox.length === 0 &&
                <RenderTextField
                  id="cwa"
                  fieldlabel="CWA"
                  value={this.state.cwa}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
              }
              {this.state.county.length === 0 && 
               this.state.climdiv.length === 0 && 
               this.state.cwa.length === 0 && 
               this.state.sids.length === 0 && 
               this.state.bbox.length === 0 &&
                <RenderTextField
                  id="basin"
                  fieldlabel="Basin"
                  value={this.state.basin}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
              }
              {this.state.county.length === 0 && 
               this.state.climdiv.length === 0 && 
               this.state.cwa.length === 0 && 
               this.state.basin.length === 0 && 
               this.state.state.length === 0 &&
               this.state.sids.length === 0 &&
                <RenderTextField
                  id="bbox"
                  fieldlabel="Bounding box"
                  value={this.state.bbox}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
              }
              {this.state.county.length === 0 && 
               this.state.climdiv.length === 0 && 
               this.state.cwa.length === 0 && 
               this.state.basin.length === 0 && 
               this.state.state.length === 0 &&
               this.state.bbox.length === 0 &&
                <RenderTextField
                  id="sids"
                  fieldlabel="Station IDs"
                  value={this.state.sids}
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
                id="elems"
                fieldlabel="Elements"
                value={this.state.elems}
                options={{style: {width:"90%"}, multiline: true, placeholder: "Enter directly or build using Element setup"}}
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
              <QueryExplain
                input_params={this.props.input_params}
                wstype="StnData"
              />
            </Grid>

            <Grid item xs={4}>
              <Typography variant="h6">
                Optional element setup
              </Typography>
              <RenderTextField
                id="name"
                fieldlabel="Name"
                value={this.state.name}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElemBuild}
              />
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
              {!notdly &&
                <RenderTextField
                  id="add"
                  fieldlabel="Add"
                  value={this.state.add}
                  options={{}}
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
              {this.state.reduce.length > 0 && notdly &&
                <div>
                  <RenderTextField
                    id="reduce_add"
                    fieldlabel="- Reduce Add"
                    value={this.state.reduce_add}
                    options={{style:{marginLeft:"2em"}}}
                    updateHelpFor={this.updateHelpFor}
                    updateParam={this.updateElemBuild}
                  />
                </div>
              }
              {this.state.reduce.length > 0 && notdly &&
                <RenderTextField
                  id="reduce_n"
                  fieldlabel="- Reduce Number"
                  value={this.state.reduce_n}
                  options={{style:{marginLeft:"2em"}}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }
              {this.state.reduce.includes("run") && notdly &&
                <RenderTextField
                  id="reduce_run_maxmissing"
                  fieldlabel="- Run max missing"
                  value={this.state.reduce_run_maxmissing}
                  options={{style:{marginLeft:"2em"}}}
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
                id="smry"
                fieldlabel="Summary"
                value={this.state.smry}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElemBuild}
              />
              {this.state.smry.length > 0 &&
                <div>
                  <RenderTextField
                    id="smry_add"
                    fieldlabel="- Smry Add"
                    value={this.state.smry_add}
                    options={{style:{marginLeft:"2em"}}}
                    updateHelpFor={this.updateHelpFor}
                    updateParam={this.updateElemBuild}
                  />
                </div>
              }
              {this.state.smry.length > 0 &&
                <RenderTextField
                  id="smry_n"
                  fieldlabel="- Smry Number"
                  value={this.state.smry_n}
                  options={{style:{marginLeft:"2em"}}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }
              {this.state.smry.length > 0 && this.state.smry.includes('run') &&
                <RenderTextField
                  id="smry_run_maxmissing"
                  fieldlabel="- Smry Max missing"
                  value={this.state.smry_run_maxmissing}
                  options={{style:{marginLeft:"2em"}}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }
              {this.state.smry.length > 0 &&
                <RenderTextField
                  id="smry_only"
                  fieldlabel="Summary only"
                  value={this.state.smry_only}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }
              <RenderTextField
                id="normal"
                fieldlabel="Normal"
                value={this.state.normal}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElemBuild}
              />
              {this.state.interval !== 'yly' &&
                <RenderTextField
                  id="groupby"
                  fieldlabel="Group by"
                  value={this.state.groupby}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateElemBuild}
                />
              }
              <RenderTextField
                id="prec"
                fieldlabel="Precision"
                value={this.state.prec}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElemBuild}
              />

              {this.state.name.length > 0 &&
                <Button 
                  size="small"
                  variant="outlined"
                  style={{marginTop:"0.5em", backgroundColor:"lightcyan"}}
                  onMouseDown={this.addElement}
                >
                  Add element
                </Button>
              }
              {this.state.name.length > 0 && this.state.elems.includes("{") &&
                <Button 
                  size="small"
                  variant="outlined"
                  style={{marginTop:"0.5em", marginLeft:"0.5em", backgroundColor:"lightcyan"}}
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
                id="network"
                fieldlabel="Network"
                value={this.state.network}
                options={{}}
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
            </Grid>
          </Grid>
      </div>
    )
  }
}
