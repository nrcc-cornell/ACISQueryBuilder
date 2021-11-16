import React, { Component } from 'react'
import Chip from '@material-ui/core/Chip'
import RenderTextField from './RenderTextField'

export default class DateSelection extends Component { 
  constructor(props) {
    super(props)
    this.state = {
      sdate: '',
      edate: '',
      date: '',
      datetype: 'pair',
    }
  }

  updateParam = (update) => {
    this.setState(update)
    this.props.updateParam(update)
  }

  updateDates = () => {
    this.props.updateParam({
      sdate:this.state.sdate,
      edate:this.state.edate,
      date:this.state.date
    })
  }

  handleChipClick = () => {
    if (this.state.datetype === 'pair') {
      const sdate = this.state.sdate
      this.setState({
        sdate:"", 
        edate:"", 
        date:sdate, 
        datetype:"single"
      }, this.updateDates)
    } else {
      const date = this.state.date
      this.setState({
        date: "", 
        sdate:date, 
        datetype:"pair"
      }, this.updateDates)
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props !== prevProps) {
      this.setState({
        sdate: this.props.sdate,
        edate: this.props.edate,
        date: this.props.date,
      })
    }
  }

  render () {
    return (
      <div>
        <Chip
          label={this.state.datetype === 'pair' ? "Change to single date" : "Change to start/end dates"}
          clickable={true}
          variant="outlined"
          tabIndex="-1"
          style={{marginBottom:"0.5em", marginTop:"0.5em"}}
          onClick={this.handleChipClick}
        />
        {this.state.datetype === 'pair' &&
          <div>
            <RenderTextField
            id="sdate"
            fieldlabel="Start date"
            value={this.state.sdate}
            options={{}}
            updateHelpFor={this.props.updateHelpFor}
            updateParam={this.updateParam}
            />
            <RenderTextField
            id="edate"
            fieldlabel="End date"
            value={this.state.edate}
            options={{}}
            updateHelpFor={this.props.updateHelpFor}
            updateParam={this.updateParam}
            />
          </div>
        }
        {this.state.datetype === 'single' &&
          <RenderTextField
              id="date"
              fieldlabel="Date"
              value={this.state.date}
              options={{}}
              updateHelpFor={this.props.updateHelpFor}
              updateParam={this.updateParam}
          />
        }
      </div>
    )
  }
}