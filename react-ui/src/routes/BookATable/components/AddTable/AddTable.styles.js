export default theme => ({
  root: {
    ...theme.flexRowCenter,
    alignItems: 'center',
    cursor: 'pointer',
    height: 86,
    width: 345,
    margin: '6px 0 6px 0',
    padding: theme.spacing(1.3),
    overflow: 'hidden'
  },
  newIcon: {
    width: '3rem',
    height: '3rem',
    transition: 'all 800ms cubic-bezier(0.25,0.1,0.25,1) 0ms',
    '&:hover': {
      color: '#757575'
    }
  }
})
