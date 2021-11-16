import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  footer: {
    padding: "1em",
  },
  button: {
    color: "darkblue",
    lineHeight: "1",
    fontSize: "75%",
    textTransform: "capitalize",
    fontWeight: "normal",
  },
  menuitem: {
    height: "18px",
    fontSize: "75%"
  },
}

const options = ['Any','NRCC','HPRCC',"AWS1"] //removed SRCC and added AWS1 -kle 2021-5-4

class Footer extends Component { 
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
    }
  }

  handleOpenMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }
  
  handleCloseMenu = () => {
    this.setState({ anchorEl: null })
  }

  handleMenuSelect = (server) => {
    this.setState({ anchorEl: null })
    this.props.updateAppState({ server })
  }
  
  render() {
    const { classes } = this.props
    return (
      <footer className={classes.footer}>
        <Grid container>
          <Grid item xs={6}>
            <Button className={classes.button} variant="text" size="small" onClick={this.handleOpenMenu}>
              Select specific server {this.props.server !== 'Any' && 
                "(" + this.props.server + ")"
              }
            </Button>
            <Menu
              open={Boolean(this.state.anchorEl)}
              anchorEl={this.state.anchorEl}
              onClose={this.handleCloseMenu}
            >
              {options.map(option => (
                <MenuItem
                  key={option}
                  selected={option === this.props.server}
                  className={classes.menuitem}
                  onClick={() => this.handleMenuSelect(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu> 
          </Grid>

          <Grid item xs={6}>
            <Typography align="right" color="primary" variant="caption">
              <a href='https://www.rcc-acis.org/docs_webservices.html' target="blank">Full documentation</a>
              <br /><a href='https://builder.rcc-acis.org/index2.html'>Previous version of Query Builder</a>
            </Typography>
          </Grid>
        </Grid>
      </footer>
    )
  }
}

export default withStyles(styles)(Footer)