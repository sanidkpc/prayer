const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 1,
  }),
  marginTop:{
  	marginTop: theme.spacing.unit * 1,
  },
  avatar: {
    backgroundColor: 'red',
  },
  media: {
    height: 194,
  },
  actions: {
    display: 'flex',
  },
  modalstyle: {
    position: 'absolute',
    width: theme.spacing.unit * 80,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});
export default styles;