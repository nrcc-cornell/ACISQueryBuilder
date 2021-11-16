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

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.props.input_params.elems !== nextProps.input_params.elems ||
        this.props.input_params.sdate !== nextProps.input_params.sdate || 
        this.props.input_params.edate !== nextProps.input_params.edate) {
      return true
    }
    if (this.state.exptext !== nextState.exptext) {
      return true
    }
    return false
  }

  componentDidUpdate = prevProps => {
    const exptext = buildExplanation(this.props.input_params)
    this.setState({exptext})
  }

  render() {
    return (
      <Paper elevation={0} style={{marginTop:"1em"}}>
        {this.state.exptext &&
          <div>
            <Paper 
              elevation={3} 
              style={{
                border:"1px solid lightgray", 
                margin:"0", 
                padding:"10px", 
                width:"85%",
                backgroundColor:"#f4ffff"
              }}
            >
            <Typography variant="body2" style={{fontWeight:"bold"}}>
              Expected return:
            </Typography>
            <Typography style={{fontSize:"80%"}}>
              {this.state.exptext}
            </Typography>
            </Paper>
          </div>
        }
      </Paper>
    )
  }
}