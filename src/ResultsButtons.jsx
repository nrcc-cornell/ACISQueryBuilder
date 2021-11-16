import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { withStyles } from '@material-ui/core/styles'

const styles = {
   // ToggleButton
   root: {
    background: "white",
    color: "darkblue",
    textTransform: "none",
    borderRight: "1pt solid lightgray"
  },
  selected: {
    background: "blue !important",
    color: "white !important"
  },
  // Paper
  paperRoot: {
    margin: "1em 0",
  }
}

const buttonLabels = ['JSON', 'Basic format', 'Full format']

class ResultsButtons extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedButton: "JSON",
    }
  }

  handleChange = (event) => {
    const value = event.currentTarget.value
    this.setState({ 
      selectedButton: value
    })
    this.props.handleFormat(value)
  }

  componentDidMount() {
    this.setState({selectedButton: this.props.selectedButton})
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        selectedButton: this.props.selectedButton
      })
    }
  }

  render() {
    const {classes} = this.props
    return (
      <Paper elevation={0} classes={{root:classes.paperRoot}}>
        <Grid container spacing={16}>
          <Grid item>
            <Typography variant="h6">
              Results:
            </Typography>
          </Grid>
          <Grid item>
            {this.props.showButtons &&
              <ToggleButtonGroup value={this.state.selectedButton} exclusive onChange={this.handleChange}>
                  {buttonLabels.map((item) => (
                    <ToggleButton 
                      key={item} 
                      value={item} 
                      classes={{root:classes.root, selected:classes.selected}}
                    >
                      {item}
                    </ToggleButton>                  
                  ))}
              </ToggleButtonGroup>
            }
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default withStyles(styles)(ResultsButtons)