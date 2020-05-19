import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  ButtonBase,
  GridList,
  GridListTile,
  Typography
} from "@material-ui/core";
import styles from "./DisplayTable.styles"

const useStyles = makeStyles(styles);

function DisplayTable(props) {
  const { handleTable, tableData } = props;
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <GridList
        // maxWidth="100%"
        cellHeight={64}
        className={classes.gridList}
        cols={6}
      >
        {tableData.map(table => (
          <GridListTile key={table.id} cols={table.cols || 1}>
            <ButtonBase
              focusRipple
              disableTouchRipple
              disabled={!table.tableNumber}
              className={classes.image}
              focusVisibleClassName={classes.focusVisible}
              style={{ maxHeight: 64, maxWidth: 64 * (table.cols || 1) }}
              onClick={() => handleTable(table)}
            >
              <span
                className={`${classes.imageSrc} ${!table.isEmpty &&
                  classes.tableNotEmpty}`}
                style={{
                  backgroundImage: `url(${table.img})`
                }}
              />
              <span className={classes.imageButton}>
                <Typography
                  component="span"
                  variant="subtitle1"
                  color="inherit"
                  className={classes.tableNumber}
                >
                  {table.tableNumber != "0" && table.tableNumber}
                </Typography>
              </span>
            </ButtonBase>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

DisplayTable.propTypes = {
  handleTable: PropTypes.func.isRequired,
  tableData: PropTypes.array.isRequired,
};

export default DisplayTable