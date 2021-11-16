import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import RenderTextField from './RenderTextField'
//import { buildInputParams } from './Builders.jsx'

export default class GeneralInput extends Component { 
  constructor(props) {
    super(props)
    this.state = {
      state: '',
      bbox: '',
      id: '',
      meta: '',
      generalArea: '',
    }
    this.paramfields = Object.keys(this.state).filter(item => !["generalArea"].includes(item))
  }

  updateHelpFor = (helpFor) => {
    if (helpFor === 'id') {
      helpFor = 'general_id'
    } else if (helpFor === 'meta') {
      helpFor = "general_meta"
    }
    this.props.updateAppState({helpFor: helpFor})
  }
  
  updateArea = event => {
    this.setState({
      generalArea: event.target.value
    })
    this.props.updateAppState({generalArea: event.target.value})
  }

  updateParam = (update) => {
    this.setState(update)
    this.props.updateInputParams(update)
  }

  componentDidMount = () => {
    // set to default and update in App
    this.updateArea({target:{value:'state'}})
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.state !== nextState) {
      return true
    } else if (this.props !== nextProps) {
      return this.paramfields.some((key) => (nextProps.input_params.hasOwnProperty(key) && this.state[key] !== nextProps.input_params[key]) ||
            (!nextProps.input_params.hasOwnProperty(key) && this.state[key] !== ''))
    } else {
      return false
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.input_params !== prevProps.input_params) {
      this.paramfields.forEach((key) => {
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

              <TextField
                id="general-area"
                select
                label="Area"
                value={this.state.generalArea}
                onChange={this.updateArea}
                SelectProps={{ style: {"fontSize":"90%"} }}
                margin="dense"
                variant="outlined"
              >
                <MenuItem style={{fontSize:"90%"}} value={'state'}>state</MenuItem>
                <MenuItem style={{fontSize:"90%"}} value={'county'}>county</MenuItem>
                <MenuItem style={{fontSize:"90%"}} value={'climdiv'}>climdiv</MenuItem>
                <MenuItem style={{fontSize:"90%"}} value={'cwa'}>cwa</MenuItem>
                <MenuItem style={{fontSize:"90%"}} value={'basin'}>basin</MenuItem>
              </TextField>

              <Typography variant="caption">
                Enter one of the following:
              </Typography>
              {this.state.id.length === 0 && this.state.bbox.length === 0 &&
                <RenderTextField
                  id="state"
                  fieldlabel="State"
                  value={this.state.state}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
              }
              {this.state.state.length === 0 && this.state.bbox.length === 0 &&
                <RenderTextField
                  id="id"
                  fieldlabel="ID"
                  value={this.state.id}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
                />
              }
              {this.state.state.length === 0 && this.state.id.length === 0 &&
                <RenderTextField
                  id="bbox"
                  fieldlabel="Bounding box"
                  value={this.state.bbox}
                  options={{}}
                  updateHelpFor={this.updateHelpFor}
                  updateParam={this.updateParam}
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
                value={this.state.meta}
                options={{}}
                updateHelpFor={this.updateHelpFor}
                updateParam={this.updateParam}
              />
            </Grid>
          </Grid>
      </div>
    )
  }
}
