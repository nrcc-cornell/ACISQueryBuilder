import React from 'react'
import ReactGA from 'react-ga4'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import App from './App.jsx'

document.title = 'ACIS QueryBuilder'

//ReactGA.initialize('UA-47226172-1')
//ReactGA.pageview('Builder-pageview')    
ReactGA.initialize('G-9QJ5KGF503')

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
)
