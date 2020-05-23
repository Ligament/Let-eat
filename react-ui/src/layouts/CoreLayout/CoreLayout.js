import React from 'react'
import PropTypes from 'prop-types'
import Navbar from 'containers/Navbar'
import { Notifications } from 'modules/notification'
import { makeStyles } from '@material-ui/core/styles'
import styles from './CoreLayout.styles'
import { CssBaseline, AppBar } from '@material-ui/core'
import BottomNavbar from 'containers/BottomNavbar'

const useStyles = makeStyles(styles)

function CoreLayout({ children }) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      {/* <Navbar /> */}
      <CssBaseline />
      <div className={classes.children}>{children}</div>
      <Notifications />
      <AppBar position="fixed" style={{top: 'auto', bottom: 0}}>
      <BottomNavbar />
      </AppBar>
    </div>
  )
}

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired
}

export default CoreLayout
