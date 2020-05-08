export default theme => ({
  root: {
    ...theme.flexColumnCenter,
    justifyContent: 'flex-start',
    flexGrow: 1,
    height: '100%',
    width: '100%',
    padding: '1.2rem',
    fontSize: '1.4rem'
  },
  submit: {
    ...theme.flexColumnCenter,
    justifyContent: 'center',
    flexGrow: 1,
    textAlign: 'center',
    padding: '1.25rem',
    minWidth: '192px',
    marginTop: '1.5rem'
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 202,
  },
})
