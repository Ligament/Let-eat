import React from 'react'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { isLoaded, isEmpty, useFirebase } from 'react-redux-firebase'
import { BOOK_A_TABLE, FOOD_MENU_PATH } from 'constants/paths'
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import styles from './BottomNavbar.styles'
import { BottomNavigationAction, BottomNavigation } from '@material-ui/core'

const useStyles = makeStyles(styles)

function BottomNavbar() {
  const classes = useStyles()
  const [value, setValue] = React.useState(0);

  // Get auth from redux state
  const auth = useSelector(state => state.firebase.auth)
  const profile = useSelector(state => state.firebase.profile)
  const authExists = isLoaded(auth) && !isEmpty(auth)
  const firebase = useFirebase()
  function updateUserProfile() {
    return firebase.updateProfile({ role: 'admin' })
  }

  console.log(profile);
  

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="จองโต๊ะ" icon={<ViewModuleIcon />} />
      <BottomNavigationAction label="รายการอาหาร" icon={<MenuBookIcon />} />
      <BottomNavigationAction label="อาหารที่สั่ง" icon={<RestaurantMenuIcon />} onClick={updateUserProfile} />
    </BottomNavigation>
  )
}

export default BottomNavbar