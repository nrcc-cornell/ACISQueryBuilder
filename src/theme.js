import { createTheme } from '@mui/material/styles';

const theme = createTheme(({
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border:"1px solid lightgray !important", 
          background:"lightcyan",
          color:"darkblue",
          textTransform:"none",
          padding:"6px 12px",     
          "&.Mui-selected": {
            background: "blue !important",
            color: "white !important",
          },
          "&:hover": {
            backgroundColor: "lightblue",
          },
        },
      }
    },       
    MuiButton: {
      styleOverrides: {
        root: {
          background:"lightcyan",
          color:"darkblue",
          border:"1px solid lightgray",
          marginTop:"0.5em",
          "&:hover": {
            backgroundColor: "lightblue",
          },
        },
      },
      variants: [
        {
          props: { variant: "verysmall" },
          style: {
            textTransform: 'none',
            lineHeight: "0.75em",
            fontSize: "80%",
            fontWeight: "normal",
          },
        },
        {
          props: { variant: "go" },
          style: {
            marginLeft:"2em", 
            backgroundColor:"forestgreen",
            color:"white",
            "&:hover": {
              backgroundColor: "lightgreen",
              color:"darkgreen",
              border:"1px solid forestgreen",
            },
          },
        },
      ],
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "85%",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          paddingTop: "1px",
          paddingBottom: "1px",
        },
      },
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: "helpPaper" },
          style: {
            border:"1px solid gray", 
            margin:"1em 10%",
            padding:"3px",
            backgroundColor:"lightcyan",
          },
        },
        {
          props: { variant: "explainPaper" },
          style: {
            border:"1px solid lightgray", 
            margin:"0", 
            padding:"10px", 
            backgroundColor:"#f4ffff",
            width:"85%",
          },
        },
        {
          props: { variant: "resultsPaper" },
          style: {
            border:"1px solid lightgray", 
            padding:"1em 5px", 
          },
        },
      ],
    },   
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          paddingTop:"7px", 
          paddingBottom:"7px", 
          fontSize:"85%", 
        },
        multiline: {
          padding:"7px 14px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-required": {
            color: "limegreen"
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: "lightcyan"
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: "lightcyan",
          marginBottom:"0.5em", 
          marginTop:"0.5em",
          "&&:hover": {
            backgroundColor: "lightblue",
          },
          "&&:focus": {
            backgroundColor: "lightblue",
          },
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize:"80%",
          padding:"2px 1em",
        },
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: "pre" },
          style: {
            whiteSpace: "pre-wrap",
            fontSize:"95%",
            overflowWrap:"anywhere",
          },
        },
      ],
      styleOverrides: {
        h5: {
          color: "darkblue",
        },
      },
    },
  },
}))

export default theme