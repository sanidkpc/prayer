const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 1,
  }),
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  tableheaderstyle:{
  	backgroundColor: '#3F51B5',
  	'& th': {
      	color:'white',
  		fontSize: '18px'
    },
  },
  todayrow:{
  	backgroundColor: '#1976D2',
  	'& td': {
      	color:'white',
    },
  }
});
export default styles;