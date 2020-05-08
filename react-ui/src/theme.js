export default {
  palette: {
    primary: {
      main: '#2196f3'
    }
  },
  // Enable typography v2: https://material-ui.com/style/typography/#migration-to-typography-v2
  typography: {
    useNextVariants: true
  },
  flexColumnCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  flexRowCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  overrides: {
    MuiButton: {
      text: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      },
    }
  }
}
