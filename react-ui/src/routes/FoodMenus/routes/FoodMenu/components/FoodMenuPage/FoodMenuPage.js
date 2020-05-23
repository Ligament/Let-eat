import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useFirebaseConnect, isLoaded } from 'react-redux-firebase'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingSpinner from 'components/LoadingSpinner'
import styles from './FoodMenuPage.styles'

const useStyles = makeStyles(styles)

function MenuPage(props) {
  const classes = useStyles()
  const foodMenuId = props.match.params.foodMenuId

  // Create listener for projects
  useFirebaseConnect(() => [{ path: `menus/${foodMenuId}` }])

  // Get projects from redux state
  const menu = useSelector(({ firebase: { data } }) => (data.menus && data.menus[foodMenuId]))

  // Show loading spinner while project is loading
  if (!isLoaded(menu)) {
    return <LoadingSpinner />
  }

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
      <CardMedia
          component="img"
          className={classes.media}
          image={`${menu.pictureUrl}`}
          title={`${menu.foodName}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
            {menu.foodName || 'Menu'}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {menu.detail || ''}
          </Typography>
        </CardContent>
        {/* <CardContent>
          <Typography className={classes.title} component="h2">
            {menu.foodName || 'Menu'}
          </Typography>

          <div style={{ marginTop: '10rem' }}>
            <pre>{JSON.stringify(menu, null, 2)}</pre>
          </div>
        </CardContent> */}
      </Card>
    </div>
  )
}

export default MenuPage
