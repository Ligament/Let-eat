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
// import FoodMenuRoute from "routes/FoodMenus/routes/FoodMenu";
import { useNotifications } from "modules/notification";
import { renderChildren } from "utils/router";
import LoadingSpinner from "components/LoadingSpinner";
import DisplayTable from "../DisplayTable";
import AddTable from "../AddTable";
import AddTableDialog from "../AddTableDialog";
import styles from "./BookATablePage.styles";
import ConfirmTableReservationDialog from "../ActivityBookATableDialog/ConfirmTableReservationDialog";
import CancelTableReservationDialog from "../ActivityBookATableDialog/CancelTableReservationDialog";
import EditTableDialog from "../EditTableDialog";
import DeleteTableReservationDialog from "../ActivityBookATableDialog/DeleteTableReservationDialog";

const useStyles = makeStyles(styles);
const positionMap = ["4", "6", "8", "10"];

function useTables() {
  const { showSuccess, showError } = useNotifications();
  const firebase = useFirebase();
  // Get auth from redux state
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  // Attach todos listener
  useFirebaseConnect([
    { path: "images/tables" },
    {
      path: "table_set",
      queryParams: ["limitToLast=50"],
      // queryParams: ['orderByChild=createdBy', `equalTo=${auth.uid}`]
    },
    {
      type: "once",
      path: "users",
      queryParams: ["orderByChild=uid", `equalTo=${auth.uid}`],
    },
  ]);

  // Get projects from redux state
  const user = useSelector((state) => state.firebase.ordered.users);
  const tableImages = useSelector((state) => state.firebase.ordered.images);
  const tableSet = useSelector((state) => state.firebase.ordered.table_set);

  // New dialog
  const [newDialogOpen, changeNewDialogState] = useState(false);
  const [editDialogOpen, changeEditDialogState] = useState(false);
  const [confirmDialogOpen, changeConfirmDialogState] = useState(false);
  const [cancelDialogOpen, changeCancelDialogState] = useState(false);
  const [deleteDialogOpen, changeDeleteDialogState] = useState(false);

  const toggleNewDialog = () => {
    changeNewDialogState(!newDialogOpen);
  };

  const toggleEditDialog = () => {
    changeEditDialogState(!editDialogOpen);
  };

  const toggleConfirmDialog = () => {
    changeConfirmDialogState(!confirmDialogOpen);
  };

  const toggleCancelDialog = () => {
    changeCancelDialogState(!cancelDialogOpen);
  };

  const toggleDeleteDialog = () => {
    changeDeleteDialogState(!deleteDialogOpen);
  };

  function addTable(newInstance) {
    if (!auth.uid) {
      return showError("You must be logged in to add a table");
    }
    if (user[0].value.role === 'Customer') {
      return showError("You cannot add a table");
    }
    return firebase
      .push("table_set", {
        ...newInstance,
        createdBy: auth.uid,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        isEmpty: true,
      })
      .then(() => {
        toggleNewDialog();
        showSuccess("Table added successfully");
      })
      .catch((err) => {
        console.error("Error:", err); // eslint-disable-line no-console
        showError(err.message || "Could not add table");
        return Promise.reject(err);
      });
  }

  function editTable(editInstance) {
    if (!auth.uid) {
      return showError("You must be logged in to add a table");
    }
    if (user[0].value.role === 'Customer') {
      return showError("You cannot add a table");
    }
    return firebase
      .update(`table_set/${editInstance.id}`, {
        tableNumber: editInstance.tableNumber,
        tablePositionX: editInstance.tablePositionX,
        tablePositionY: editInstance.tablePositionY,
        tableSize: editInstance.tableSize,
        modifyBy: auth.uid,
        modifyAt: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(() => {
        toggleEditDialog();
        showSuccess("Table edit successfully");
      })
      .catch((err) => {
        console.error("Error:", err); // eslint-disable-line no-console
        showError(err.message || "Could not edit table");
        return Promise.reject(err);
      });
  }

  function bookATable(table) {
    if (!auth.uid) {
      return showError("You must be logged in to book a table");
    }
    return firebase
      .update(`table_set/${table.id}`, {
        isEmpty: false,
        reservationBy: auth.uid,
      })
      .then(() => {
        toggleConfirmDialog();
        showSuccess("Reservation successfully");
      })
      .catch((err) => {
        console.error("Error:", err); // eslint-disable-line no-console
        showError(err.message || "Could not reservation table");
        return Promise.reject(err);
      });
  }

  function cancelBookATable(table) {
    if (!auth.uid) {
      return showError("You must be logged in to book a table");
    }
    if (user[0].value.role !== 'Customer') {
      return firebase
        .update(`table_set/${table.id}`, { isEmpty: true, reservationBy: null })
        .then(() => {
          toggleCancelDialog();
          showSuccess("Cancel reservation successfully");
        })
        .catch((err) => {
          console.error("Error:", err); // eslint-disable-line no-console
          showError(err.message || "Could not reservation table");
          return Promise.reject(err);
        });
    }
    if (auth.uid !== table.reservationBy) {
      return showError("You cannot cancel this table reservation");
    }
    return firebase
      .update(`table_set/${table.id}`, { isEmpty: true, reservationBy: null })
      .then(() => {
        toggleCancelDialog();
        showSuccess("Cancel reservation successfully");
      })
      .catch((err) => {
        console.error("Error:", err); // eslint-disable-line no-console
        showError(err.message || "Could not reservation table");
        return Promise.reject(err);
      });
  }

  function deleteTable(table) {
    if (!auth.uid) {
      return showError("You must be logged in to delete a table");
    }
    if (user[0].value.role === 'Customer') {
      return showError("You cannot delete this table reservation");
    }
    return firebase
      .remove(`table_set/${table.id}`)
      .then(() => {
        toggleDeleteDialog();
        showSuccess("Delete successfully");
      })
      .catch((err) => {
        console.error("Error:", err); // eslint-disable-line no-console
        showError(err.message || "Could not delete table");
        return Promise.reject(err);
      });
  }

  return {
    auth,
    profile,
    user,
    tableImages,
    tableSet,
    addTable,
    editTable,
    bookATable,
    cancelBookATable,
    newDialogOpen,
    toggleNewDialog,
    editDialogOpen,
    toggleEditDialog,
    confirmDialogOpen,
    toggleConfirmDialog,
    cancelDialogOpen,
    toggleCancelDialog,
    deleteTable,
    deleteDialogOpen,
    toggleDeleteDialog
  };
}

function BookATablePage() {
  const classes = useStyles();
  const {
    auth,
    profile,
    user,
    tableImages,
    tableSet,
    addTable,
    editTable,
    bookATable,
    cancelBookATable,
    newDialogOpen,
    toggleNewDialog,
    editDialogOpen,
    toggleEditDialog,
    confirmDialogOpen,
    toggleConfirmDialog,
    cancelDialogOpen,
    toggleCancelDialog,
    deleteTable,
    deleteDialogOpen,
    toggleDeleteDialog
  } = useTables();

  var isNotCustomer = false;
  var tableData = [];

  const [selectTable, setSelectTable] = useState({
    img: "",
    createdBy: "system",
    cols: 1,
    number: "0",
    isEmpty: false,
  });

  // Show spinner while projects are loading
  if (!(isLoaded(tableImages) && isLoaded(user) && isLoaded(tableSet))) {
    return <LoadingSpinner />;
  }
  isNotCustomer = user[0].value.role !== 'Customer'

  const addTableRolesCheck = () => {
    return user[0].value.role !== "Customer";
  };

  // Get Table Picture URL Form Firebase
  const imageUrl = tableImages.tables.map((tb) => {
    return tb.value;
  });

  const emptyTable = {
    img: imageUrl[0],
    createdBy: "system",
    cols: 1,
    number: 0,
    isEmpty: false,
  };

  // Map imageUrl to table data
  /**
   * Table data structure
   * {
   * img: URL,
   * createdBy: String,
   * cols: Number,
   * number: Number,
   * isEmpty: Boolean
   * },
   */
  // const tableData = tableSet.map(tb => {
  //   return {
  //     img: imageUrl[positionMap.indexOf(tb.tableSize)+1],
  //     createdBy: tb.createdBy,
  //     cols: (positionMap.indexOf(tb.tableSize) * 0.5) + 1,
  //     number: tb.tableNumber,
  //     isEmpty: tb.isEmpty
  //   }
  // })
  tableSet.forEach((data) => {
    const tb = data.value;
    const index = (tb.tablePositionX % 6) + tb.tablePositionY * 6;
    tableData[index] = {
      ...tb,
      img: imageUrl[positionMap.indexOf(tb.tableSize) + 1],
      cols: positionMap.indexOf(tb.tableSize) * 0.5 + 1,
      id: data.key,
    };
  });
  tableData = Array.from(tableData, (item) => item || emptyTable);

  const handleDialog = (table) => {
    if (isNotCustomer) {
      setSelectTable(table);
      toggleDeleteDialog();
    } else if (table.isEmpty) {
      setSelectTable(table);
      toggleConfirmDialog();
    } else {
      setSelectTable(table);
      toggleCancelDialog();
    }
  };

  return (
    <div className={classes.root}>
      <AddTableDialog
        onSubmit={addTable}
        open={newDialogOpen}
        onRequestClose={toggleNewDialog}
      />
      <DeleteTableReservationDialog
        // onSubmit={editTable}
        open={deleteDialogOpen}
        handleOk={() => deleteTable(selectTable)}
        onRequestClose={toggleDeleteDialog}
        tableData={selectTable.tableNumber}
      />
      <ConfirmTableReservationDialog
        open={confirmDialogOpen}
        handleOk={() => bookATable(selectTable)}
        tableNumber={selectTable.tableNumber}
        onRequestClose={toggleConfirmDialog}
      />
      <CancelTableReservationDialog
        open={cancelDialogOpen}
        handleOk={() => cancelBookATable(selectTable)}
        tableNumber={selectTable.tableNumber}
        onRequestClose={toggleCancelDialog}
      />
      <div className={classes.tiles}>
        {isNotCustomer && <AddTable onClick={toggleNewDialog} />}
        {!isEmpty(tableData) && (
          <DisplayTable tableData={tableData} handleTable={handleDialog} />
        )}
      </div>
    </div>
  );
}

BookATablePage.propTypes = {
  match: PropTypes.object.isRequired, // from enhancer (withRouter)
};

export default BookATablePage;
