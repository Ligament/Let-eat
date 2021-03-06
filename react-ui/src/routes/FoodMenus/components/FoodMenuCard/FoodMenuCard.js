import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase } from "react-redux-firebase";
import { FOOD_MENU_PATH } from "constants/paths";
import styles from "./FoodMenuCard.styles";
import useNotifications from "modules/notification/components/useNotifications";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles(styles);

function FoodMenuCard({ name, detail, pictureUrl, price, foodId }) {
  const classes = useStyles();
  const history = useHistory();

  function goToMenu() {
    return history.push(`${FOOD_MENU_PATH}/${foodId}`);
  }

  return (
    <Card className={classes.root}>
      <CardActionArea className={classes.action} onClick={goToMenu}>
        <CardMedia
          // component="img"
          className={classes.cover}
          image={pictureUrl}
          title={name}
        />
        {/* <div className={classes.details}> */}
          <CardContent className={classes.content}>
            {/* <Grid zeroMinWidth className={classes.content}> */}
            <Typography component="h5" variant="h5" noWrap>
              {name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              component="p"
              noWrap
            >
              {detail}
            </Typography>
            {/* </Grid> */}
            {/* <Typography component="h5" variant="h5">
            {name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            component="p"
            noWrap
          >
            {detail}
          </Typography> */}
          </CardContent>
          {/* </div> */}
          <CardContent className={classes.price}>
            <Typography variant="subtitle1" color="textSecondary">
              {price}
            </Typography>
          </CardContent>
        
      </CardActionArea>
    </Card>
    // <Paper className={classes.root}>
    //   <div className={classes.top}>
    //     <span className={classes.name} onClick={goToMenu}>
    //       {name || 'No Name'}
    //     </span>
    //     {showDelete ? (
    //       <Tooltip title="delete">
    //         <IconButton onClick={deleteMenu}>
    //           <DeleteIcon />
    //         </IconButton>
    //       </Tooltip>
    //     ) : null}
    //   </div>
    // </Paper>
    // <Paper className={classes.paper}>
    //   <Grid container spacing={2}>
    //     <Grid item>
    //       <ButtonBase className={classes.image}>
    //         <img
    //           className={classes.img}
    //           alt="fill"
    //           src={pictureUrl}
    //         />
    //       </ButtonBase>
    //     </Grid>
    //     <Grid item xs={12} sm container>
    //       <Grid item xs container direction="column" spacing={2}>
    //         <Grid item xs>
    //           <Typography gutterBottom variant="subtitle1" onClick={goToMenu}>
    //             {name || "No Name"}
    //           </Typography>
    //         </Grid>
    //       </Grid>
    //       <Grid item>
    //         <Typography variant="subtitle1">{price}</Typography>
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </Paper>
  );
}

FoodMenuCard.propTypes = {
  name: PropTypes.string,
};

FoodMenuCard.defaultProps = {
  showDelete: true,
};

export default FoodMenuCard;
