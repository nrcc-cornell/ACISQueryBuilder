import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import RenderTextField from './RenderTextField'
import DateSelection from './DateSelection'
//import { buildInputParams } from './Builders.jsx'

export default class StnMetaInput extends Component { 
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
      meta: '',
      elems: '',
      output: '',
      network: '',
    }
    this.metafields = Object.keys(this.state)
  }

  updateHelpFor = (helpFor) => {
    this.props.updateAppState({helpFor: helpFor})
  }
  
  updateParam = (update) => {
    this.setState(update)
    this.props.updateInputParams(update)
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.state !== nextState) {
      return true
    } else if (this.props !== nextProps) {
      return this.metafields.some((key) => (nextProps.input_params.hasOwnProperty(key) && this.state[key] !== nextProps.input_params[key]) ||
            (!nextProps.input_params.hasOwnProperty(key) && this.state[key] !== ''))
    } else {
      return false
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.input_params !== prevProps.input_params) {
      this.metafields.forEach((key) => {
        if (this.props.input_params.hasOwnProperty(key) && this.state[key] !== this.props.input_params[key]) {
          this.setState({[key]: this.props.input_params[key]})
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
            <Typography variant="caption">
              Enter at least one of the following:
            </Typography>
            {this.state.county.length === 0 && 
              this.state.climdiv.length === 0 && 
              this.state.cwa.length === 0 && 
              this.state.basin.length === 0 && 
              this.state.state.length === 0 &&
              this.state.bbox.length === 0 &&
              <RenderTextField
                id="sids"
                fieldlabel="Station ID(s)"
                value={this.state.sids}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateParam}
              />
            }
            {this.state.sids.length === 0 &&
              <div>
                <RenderTextField
                  id="state"
                  fieldlabel="State"
                  value={this.state.state}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
                <RenderTextField
                  id="county"
                  fieldlabel="County"
                  value={this.state.county}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
                <RenderTextField
                  id="climdiv"
                  fieldlabel="Climate Division"
                  value={this.state.climdiv}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
                <RenderTextField
                  id="cwa"
                  fieldlabel="CWA"
                  value={this.state.cwa}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
                <RenderTextField
                  id="basin"
                  fieldlabel="Basin"
                  value={this.state.basin}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
                <RenderTextField
                  id="bbox"
                  fieldlabel="Bounding box"
                  value={this.state.bbox}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
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
              value={this.state.meta}
              options={{style: {width:"95%"}}}
              updateHelpFor={this.updateHelpFor}
              updateParam={this.updateParam}
            />
            {(this.state.sids.length === 0 || this.state.meta.includes('valid_daterange')) &&
              <RenderTextField
                id="elems"
                fieldlabel="Elements"
                value={this.state.elems}
                options={{required: this.state.meta.includes('valid_daterange') ? true : false}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateParam}
              />
            }
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

            {this.state.sids.length === 0 &&
              <DateSelection
                sdate={this.state.sdate}
                edate={this.state.edate}
                date={this.state.date}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateParam}
              />
            }
          </Grid>
        </Grid>
      </div>
    )
  }
}