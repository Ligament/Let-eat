export default (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    position: "absolute",
    width: "100%"
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    opacity: 1
  },
  imageButton: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white
  },
  focusVisible: {},
  image: {
    height: "100%",
    width: "100%",
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15
      },
      "& $imageSrc": {
        opacity: 0.55
      }
    }
  },
  tableNotEmpty: {
    opacity: 0.55
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%"
  },
  tableNumber: {
    position: "relative",
    width: "100%"
    // padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) +
    //   6}px`
  }
});
