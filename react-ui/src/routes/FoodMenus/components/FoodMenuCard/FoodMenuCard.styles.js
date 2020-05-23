export default (theme) => ({
  root: {
    display: 'flex',
    // alignItems: 'start',
    height: 86,
    width: 345,
    margin: '6px 0 6px 0',
    // padding: '6px 0 6px 0',
  },
  action: {
    display: 'flex',
    // alignItems: 'start',
    // width: 345,
    // height: 86,
    // margin: '6px 0 6px 0',
  },
  // details: {
  //   display: 'flex',
  //   flexDirection: 'column',
  // },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    minWidth: 0,
    // margin:8,
    padding: 8,
    flex: 1
  },
  price: {
    flex: 'auto 0 1',
    padding: 12
  },
  cover: {
    width: 100,
    height: '100%'
  },
  // controls: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   paddingLeft: theme.spacing(1),
  //   paddingBottom: theme.spacing(1),
  // },
  // playIcon: {
  //   height: 38,
  //   width: 38,
  // },
});
