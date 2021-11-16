import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { buildExplanation } from './Builders.jsx'

export default class QueryExplain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      exptext: null,
    }
  }

  componentDidUpdate = prevProps => {
    if (this.props.input_params.elems !== prevProps.input_params.elems ||
        this.props.input_params.sdate !== prevProps.input_params.sdate || 
        this.props.input_params.edate !== prevProps.input_params.edate) {
      const exptext = buildExplanation(this.props.input_params)
      this.setState({exptext})
    }
  }

  render() {
    return (
      <Paper elevation={0} style={{marginTop:"1em"}}>
        {this.state.exptext &&
          <div>
            <Typography variant="h6">
              Expected return
            </Typography>
            <Paper 
              elevation={0} 
              style={{
                border:"1px solid lightgray", 
                margin:"0", 
                padding:"10px", 
              }}
            >
              {this.state.exptext}
            </Paper>
          </div>
        }
      </Paper>
    )
  }
}