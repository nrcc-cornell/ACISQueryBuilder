import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import RenderTextField from './RenderTextField'
import DateSelection from './DateSelection'
import { buildElement } from './Builders.jsx'

export default class StnDataInput extends Component { 
  constructor(props) {
    super(props)
    this.state = {
      sid: '',
      sdate: '',
      edate: '',
      date: '',
      elems: '',
      vX: '',
      vN: '',
      prec: '',
      meta: '',
    }
    this.datafields = ['sid','sdate','edate','date','elems','meta']
    this.elementKays = ['vX','vN','prec']
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
    if (helpFor === 'sid') {
      helpFor = 'hrly_sid'
    } else if (helpFor === 'elems') {
      helpFor = "hrly_elems"
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
                value={this.state.sid}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateParam}
              />
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
            </Grid>

            <Grid item xs={4}>
              <Typography variant="h6">
                Optional element setup
              </Typography>
              <RenderTextField
                id="vX"
                fieldlabel="Var major"
                value={this.state.vX}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElemBuild}
              />
              <RenderTextField
                id="vN"
                fieldlabel="Var minor"
                value={this.state.vN}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElemBuild}
              />
              <RenderTextField
                id="prec"
                fieldlabel="Precision"
                value={this.state.prec}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateElemBuild}
              />

              {this.state.vX.length > 0 &&
                <Button 
                  size="small"
                  variant="outlined"
                  style={{marginTop:"0.5em", backgroundColor:"lightcyan"}}
                  onMouseDown={this.addElement}
                >
                  Add element
                </Button>
              }
              {this.state.vX.length > 0 && this.state.elems.includes("{") &&
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
            </Grid>
          </Grid>
      </div>
    )
  }
}
