import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useFirebaseConnect, isLoaded } from 'react-redux-firebase'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingSpinner from 'components/LoadingSpinner'
import styles from './FoodMenuPage.styles'

const useStyles = makeStyles(styles)

function MenuPage() {
  const { menuId } = useParams()
  const classes = useStyles()

  // Create listener for projects
  useFirebaseConnect(() => [{ path: `menus/${menuId}` }])

  console.log(menuId);
  // Get projects from redux state
  const menu = useSelector(({ firebase: { data } }) => {
    console.log('menu', data);
    
    return data.menus && data.menus[menuId]
  })

  console.log(menu);
  

  // Show loading spinner while project is loading
  if (!isLoaded(menu)) {
    return <LoadingSpinner />
  }

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} component="h2">
            {menu.name || 'Menu'}
          </Typography>
          <Typography className={classes.subtitle}>{menuId}</Typography>
          <div style={{ marginTop: '10rem' }}>
            <pre>{JSON.stringify(menu, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MenuPage
