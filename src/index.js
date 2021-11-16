import '@babel/polyfill'
import 'whatwg-fetch'
import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import App from './App.jsx'

document.title = 'ACIS QueryBuilder'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[700],
    },
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiListItem: {
      root: {
        paddingTop: "0.25em",
        paddingBottom: "0.25em",
      },
    },
  },
})


ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
)
