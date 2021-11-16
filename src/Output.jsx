import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import ResultsButtons from './ResultsButtons'

export default class Output extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input_params_string: "",
      results: "",
      results_json: {},
      format: "normal",
      isCsv: false,
      selectedButton: "JSON",
      dataimage: ""
    }
  }

  // user changed parameter string
  handleParamsChange = event => {
    this.setState({
      input_params_string: event.target.value,
      results: '',
    })
    this.props.changedInput(event.target.value)
  }  

  // submit parameter string to server
  handleSubmit = () => {
    this.setState({
      results: "Submitting request ...", 
      isCsv: this.props.input_params.output === 'csv', 
      dataimage: ""
    })
    const url = this.props.acisServer + this.props.generalArea
    if (this.props.input_params.output !== "image") {
      fetch(url, {
        method: 'POST',
        body: this.state.input_params_string,
        headers: {'Content-Type': 'application/json'}
      })
        .then(response => response.ok && !this.state.isCsv ? response.json() : response.text())
        .then(data => this.setState({
          results: typeof data === 'object' ? JSON.stringify(data,null,0) : data,
          results_json: data,
          format: typeof data === 'string' ? "pre" : "normal",
          selectedButton: typeof data === 'object' ? "JSON" : ""
        }))
        .catch(error => this.setState({
          results: 'Error: ' + error.message
        }))
    } else {
      this.setState({
        results: "image",
        results_json: '',
        format: 'normal',
        dataimage: url + '?params=' + this.state.input_params_string, 
        selectedButton: ''
       })
    }
  }

  basicFormat = (results_json) => {
    let results_string = ""
    let dataimage = ""
    Object.keys(results_json).forEach(key => {
      if (key === 'data' && results_json[key].includes("image/png;base64")) {
        dataimage =results_json[key]
      } else if (Array.isArray(results_json[key])) {
        results_string += key + ":\n"
        results_json[key].forEach(item => {
          results_string += " " + JSON.stringify(item) + "\n"
        }) 
      } else {
        results_string += key + ":\n"
        results_string += " " + JSON.stringify(results_json[key]) + "\n"
      }
    })
    return {results_string: results_string, dataimage: dataimage}
  }

  // user clicked one of the format buttons
  handleFormat = (results_button) => {
    this.setState({
      selectedButton: results_button
    })
    if (results_button === "Basic format") {
      const basicFormatResults = this.basicFormat(this.state.results_json)
      this.setState({
        results: basicFormatResults.results_string,
        format:"pre-wrap", 
        dataimage: basicFormatResults.dataimage.length > 0 ? basicFormatResults.dataimage : '',
      })
    } else if (results_button === "JSON") {
      this.setState({
        results: JSON.stringify(this.state.results_json,null,0), 
        format:"normal", 
        dataimage: "",
      })
    } else if (results_button === "Full format") {
      const hasImage = this.state.results_json.hasOwnProperty("data") && this.state.results_json.data.includes("image/png;base64")
      this.setState({
        results: JSON.stringify(this.state.results_json,null,2), 
        format: "pre-wrap", 
        dataimage: hasImage ? this.state.results_json.data : ''
      })
    } else {
      console.log('Error: unknown format button')
    }
  }

  // JSON parameters object needs to be stringified for display in text box
  componentDidMount() {
    if (Object.keys(this.props.input_params).length > 0) {
      if (this.props.input_params.hasOwnProperty("elems") && this.props.input_params.elems.includes("{")) {
        this.props.input_params.elems = JSON.parse(this.props.input_params.elems)
      }
      this.setState({input_params_string: JSON.stringify(this.props.input_params)})
    }
  }

  // JSON parameters object needs to be stringified for display in text box
  componentDidUpdate(prevProps) {
    if (this.props.input_params !== prevProps.input_params) {
      if (this.props.input_params.hasOwnProperty("elems") && this.props.input_params.elems.includes("{")) {
        this.props.input_params.elems = JSON.parse(this.props.input_params.elems)
      }
      // empty bbox has to be converted from string to empty array in parameters string
      if (this.props.input_params.hasOwnProperty('bbox') && this.props.input_params.bbox === "[]") {
        this.props.input_params.bbox = []
      }
      this.setState({input_params_string: JSON.stringify(this.props.input_params)})
      if (Object.keys(this.props.input_params).length === 0) {
        this.setState({results:''})
      }
    }
  }

  render() {
    return (
      <Paper elevation={0} style={{marginTop:"1em"}}>
        <Typography variant="h6">
          Parameters (JSON)
          {this.state.input_params_string.length > 2 &&
            <Button 
              variant="contained"
              size="small"
              style={{marginLeft:"3em", backgroundColor:"limegreen"}}
              onMouseDown={this.handleSubmit}
            >
              Submit
            </Button>
          }
        </Typography>
        <TextField
          id="params"
          value={this.state.input_params_string}
          margin="dense"
          variant="outlined"
          multiline={true}
          fullWidth={true}
          inputProps={{style:{fontFamily:"Arial, Helvetica, sans-serif", fontSize:"95%"}}}
          onChange={this.handleParamsChange}
        />

        {this.state.results.length > 0 && 
          <div>
            {this.state.results !== "image" &&
              <ResultsButtons
                handleFormat={this.handleFormat}
                showButtons={!this.state.isCsv}
                selectedButton={this.state.selectedButton}
              />
            }
            <Paper 
              elevation={0} 
              style={{
                border:"1px solid lightgray", 
                margin:"0", 
                padding:"5px", 
                fontFamily:"Arial, Helvetica, sans-serif", 
                fontSize:"95%"
              }}
            >
              {this.state.dataimage.length > 0 &&
                <div>
                  <pre>
                    {this.state.dataimage.includes("http") ? "Returned image" : "data (as image)"}
                  </pre>
                  <img src={this.state.dataimage} alt="map" />
                </div>
              }
              {!this.state.dataimage.includes("http") &&
                <pre style={{whiteSpace:this.state.format, wordBreak:"break-word"}}>
                  {this.state.results}
                </pre>
              }
            </Paper>
          </div>
        }
      </Paper>
    )
  }
}