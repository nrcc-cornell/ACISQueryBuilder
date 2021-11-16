import React, { Component } from 'react'
import ReactGA from 'react-ga'
import QuerySelector from './QuerySelector.jsx'
import StnMetaInput from './StnMetaInput.jsx'
import StnDataInput from './StnDataInput.jsx'
import MultiStnDataInput from './MultiStnDataInput.jsx'
import StnHourlyInput from './StnHourlyInput.jsx'
import GridDataInput from './GridDataInput.jsx'
import GridData2Input from './GridData2Input.jsx'
import GeneralInput from './GeneralInput.jsx'
import Output from './Output'
import HelpTable from './HelpTable'
import Footer from './Footer.jsx'
//import QueryExplain from './QueryExplain'

const acis_servers = {
  StnMeta: "https://data.rcc-acis.org/StnMeta",
  StnData: "https://data.rcc-acis.org/StnData",
  MultiStnData: "https://data.rcc-acis.org/MultiStnData",
  GridData: "https://data.rcc-acis.org/GridData",
  GridData2: "https://grid2.rcc-acis.org/GridData",
  StnHourly: "https://data.nrcc.rcc-acis.org/StnData",
  General: "https://data.rcc-acis.org/General/",
}
const query_types = Object.keys(acis_servers)

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      wstype: 'StnData',
      input_params: {},
      generalArea: '',
      helpFor: null,
      server: 'Any',
    }
  }

  componentDidMount() {
    ReactGA.initialize('UA-47226172-1')
    ReactGA.pageview('Builder-pageview')    
  }

  handleQueryChange = (value) => {
    this.setState({ 
      wstype: value, 
      input_params: {},
      generalArea: '',
      helpFor: null,
    })
  }

  handleInputStringChange = (inputString) => {
    if (inputString.length > 0) {
      try {
        this.setState({
          input_params: JSON.parse(inputString)
        })
      } catch {
        return
      }
    }
  }

  updateInputParams = (changes) => {
    let input_params = {...this.state.input_params}
    Object.keys(changes).forEach((key) => {
      const value = changes[key]
      if (value || (typeof value === 'object' && Object.keys(value).length > 0)) {
        input_params[key] = value
      } else {
        delete input_params[key]
      }
    })
    this.setState({ input_params })
  }

  updateAppState = (change) => {
    this.setState(change)
  }
  
   render() {
    let acisServer = acis_servers[this.state.wstype]
    const datarccindex = acisServer.indexOf('data.rcc-acis')
    if (datarccindex !== -1 && this.state.server !== 'Any') {
      acisServer = acisServer.substring(0,datarccindex+4) + "." + this.state.server.toLowerCase() + acisServer.substring(datarccindex+4)
    }
    return (
      <div>
        <QuerySelector
          query_types={query_types}
          wstype={this.state.wstype}
          handleChange={this.handleQueryChange}
        />
        {this.state.wstype === "StnMeta" && 
          <StnMetaInput 
            updateInputParams={this.updateInputParams}
            updateAppState={this.updateAppState}
            input_params={this.state.input_params}
          />
        }
        {this.state.wstype === "StnData" && 
          <StnDataInput 
            updateInputParams={this.updateInputParams}
            updateAppState={this.updateAppState}
            input_params={this.state.input_params}
          />
        }
        {this.state.wstype === "MultiStnData" && 
          <MultiStnDataInput 
            updateInputParams={this.updateInputParams}
            updateAppState={this.updateAppState}
            input_params={this.state.input_params}
          />
        }
        {this.state.wstype === "StnHourly" && 
          <StnHourlyInput 
            updateInputParams={this.updateInputParams}
            updateAppState={this.updateAppState}
            input_params={this.state.input_params}
          />
        }
        {this.state.wstype === "GridData" && 
          <GridDataInput 
            updateInputParams={this.updateInputParams}
            updateAppState={this.updateAppState}
            input_params={this.state.input_params}
          />
        }
        {this.state.wstype === "GridData2" && 
          <GridData2Input 
            updateInputParams={this.updateInputParams}
            updateAppState={this.updateAppState}
            input_params={this.state.input_params}
          />
        }
        {this.state.wstype === "General" && 
          <GeneralInput 
            updateInputParams={this.updateInputParams}
            updateAppState={this.updateAppState}
            input_params={this.state.input_params}
          />
        }
        {this.state.helpFor && 
          <HelpTable 
            id={this.state.helpFor}
          /> 
        }
        <Output
          input_params={this.state.input_params} 
          changedInput={this.handleInputStringChange}
          generalArea={this.state.generalArea}
          acisServer={acisServer}
          server={this.state.server}
        />
        {this.state.wstype !== 'StnHourly' && this.state.wstype !== 'GridData2' &&
          <Footer 
            server={this.state.server}
            updateAppState={this.updateAppState}
          />
        }
      </div>
    )
  }
}