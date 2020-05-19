import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  isEmpty,
  isLoaded,
  useFirebase,
  useFirebaseConnect,
  firebaseConnect,
} from "react-redux-firebase";
import { Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import FoodMenuRoute from "routes/FoodMenus/routes/FoodMenu";
import { useNotifications } from "modules/notification";
import { renderChildren } from "utils/router";
import LoadingSpinner from "components/LoadingSpinner";
import FoodMenuCard from "../FoodMenuCard";
import AddFoodMenu from "../AddFoodMenu";
import NewFoodMenuDialog from "../NewFoodMenuDialog";
import styles from "./FoodMenusPage.styles";
import Uploader from "components/FormUploadField/Uploader";

const useStyles = makeStyles(styles);

function useMenus() {
  const { showSuccess, showError } = useNotifications();
  const firebase = useFirebase();
  // Get auth from redux state
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  // Attach todos listener
  useFirebaseConnect(
    [
      {
        path: "menus",
        queryParams: ["limitToLast=50"],
        // queryParams: ['orderByChild=createdBy', `equalTo=${auth.uid}`]
      },
      {
        type: "once",
        path: "users",
        queryParams: ['orderByChild=uid', `equalTo=${auth.uid}`],
      },
    ],
  );

  // Get projects from redux state
  const user = useSelector((state) => state.firebase.ordered.users);
  const menus = useSelector((state) => state.firebase.ordered.menus);

  // New dialog
  const [newDialogOpen, changeDialogState] = useState(false);
  const toggleDialog = () => changeDialogState(!newDialogOpen);
  // const uploadedFiles = useSelector(({ firebase: { data } }) => data['foodPicture'])
  // console.log('outadd',uploadedFiles);

  function addMenu(newInstance) {
    if (!auth.uid) {
      return showError("You must be logged in to create a menu");
    }
    console.log('FoodAdd',newInstance);
    // firebase.uploadFiles('foodPicture', newInstance.foodPicture, 'foodPicture');
    // console.log('inAdd', uploadedFiles);

    // const uploadTask = firebase
    //   .storage
    //   .ref(`/images/${newInstance.foodPicture[0].name}`)
    //   .put(newInstance.foodPicture[0]);
    // uploadTask.on(
    //   "state_changed",
    //   (snapShot) => {
    //     //takes a snap shot of the process as it is happening
    //     console.log("uploadTask", snapShot);
    //     var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
    //     console.log("uploadTask", "Upload is " + progress + "% done");
    //   },
    //   (err) => {
    //     //catches the errors
    //     console.log("uploadTask", err);
    //   },
    //   () => {
    //     // gets the functions from storage refences the image storage in firebase by the children
    //     // gets the download url then sets the image from firebase as the value for the imgUrl key:
    //     var downloadURL = uploadTask.snapshot.downloadURL;
    //     console.log("uploadTask: downloadURL", downloadURL);

    //     firebase
    //       .storage
    //       .ref("images")
    //       .child(newInstance.foodPicture[0].name)
    //       .getDownloadURL()
    //       .then((fireBaseUrl) => {
    //         console.log("uploadTask: fireBaseUrl", fireBaseUrl);
    //       });
    //   }
    // );
    return firebase
      .push("menus", {
        ...newInstance,
        createdBy: auth.uid,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(() => {
        toggleDialog();
        showSuccess("Menu added successfully");
      })
      .catch((err) => {
        console.error("Error:", err); // eslint-disable-line no-console
        showError(err.message || "Could not add menu");
        return Promise.reject(err);
      });
  }

  return { auth, profile, user, menus, addMenu, newDialogOpen, toggleDialog };
}

function MenusPage({ match }) {
  const classes = useStyles();
  const {
    auth,
    profile,
    user,
    menus,
    addMenu,
    newDialogOpen,
    toggleDialog,
  } = useMenus();
  var isNotCustomer = false
  // Show spinner while projects are loading
  if (!isLoaded(menus) && !isLoaded(user)) {
    return <LoadingSpinner />;
  } else if (isLoaded(user)) {
    isNotCustomer = user[0].value.role !== 'customer'
  }

  return (
    <Switch>
      {/* Child routes */}
      {renderChildren([FoodMenuRoute], match, { auth })}
      {/* Main Route */}
      <Route
        exact
        path={match.path}
        render={() => (
          <div className={classes.root}>
            <NewFoodMenuDialog
              onSubmit={addMenu}
              open={newDialogOpen}
              onRequestClose={toggleDialog}
            />
            {/* <Uploader></Uploader> */}
            <div className={classes.tiles}>
              {isNotCustomer && <AddFoodMenu onClick={toggleDialog} />}
              {/* <AddFoodMenu onClick={toggleDialog} /> */}
              {/* <div className={classes.menu}> */}
              {!isEmpty(menus) &&
                menus.map((menu, ind) => {
                  return (
                    <FoodMenuCard
                      key={`FoodMenu-${menu.key}-${ind}`}
                      name={menu.value.foodName}
                      detail={menu.value.detail}
                      price={menu.value.price}
                      pictureUrl={menu.value.pictureUrl}
                      projectId={menu.key}
                    />
                  );
                })}
              {/* </div> */}
            </div>
          </div>
        )}
      />
    </Switch>
  );
}

MenusPage.propTypes = {
  match: PropTypes.object.isRequired, // from enhancer (withRouter)
};

export default MenusPage;
