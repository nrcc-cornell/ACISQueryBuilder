import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  // classes for ToggleButton
  root: {
    background:"white",
    color:"darkblue",
    textTransform:"none",
    borderRight:"1pt solid lightgray"
  },
  selected: {
    background: "blue !important",
    color:"white !important"
  },
  // class for Paper
  paperRoot: {
    margin: "0 0 2em"
  },
  // class for page title typography
  titleRoot: {
    color: "darkblue"
  },
}

class QuerySelector extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wstype: '',
    }
  }

  handleChange = (event, value) => {
    if (value) {
      this.setState({ wstype: value})
      this.props.handleChange(value)
    }
  }

  componentDidMount() {
    this.setState({wstype: this.props.wstype})
  }

  componentDidUpdate(prevProps) {
    if (this.props.wstype !== prevProps.wstype) {
      this.setState({wstype: this.props.wstype})
    }
  }

  render() {
    const {classes} = this.props
    return (
      <Paper elevation={0} classes={{root:classes.paperRoot}}>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5" classes={{root:classes.titleRoot}}>
              ACIS Query Builder
            </Typography>
          </Grid>
          <Grid item>
            <ToggleButtonGroup value={this.state.wstype} exclusive onChange={this.handleChange}>
              {this.props.query_types.map((item) => (
                <ToggleButton 
                  key={item} 
                  value={item}
                  classes={{root:classes.root, selected:classes.selected}}
                >
                  {item}
              </ToggleButton>                  
              ))}
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

export default withStyles(styles)(QuerySelector)