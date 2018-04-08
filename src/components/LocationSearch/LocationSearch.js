import React, { Component } from 'react';
import styles from './styles'
import Translate from '../../language/language';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';


class LocationSearch extends Component{
	constructor(props){
		super(props);
    this.searchInput = React.createRef();
    this.autocomplete = null;
    this.state={
      snackbarOpen:false,
      geolocationhandelmessage:false,
    }
	}
	onLocationSearch=(event)=>{
		this.props.onLocationSearch(event.target.value);
	}
  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ snackbarOpen: false });
  }
  getUserCurrentLocation=(event)=>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          this.props.onGeolocationChange({
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
          });
          this.props.onLocationSearch('');
        }, (error)=>{
          switch(error.code) {
              case error.PERMISSION_DENIED:
                  this.setState({
                    geolocationhandelmessage:'User denied the request for Geolocation.',
                    snackbarOpen: true
                  });
                  break;
              case error.POSITION_UNAVAILABLE:
                  this.setState({
                    geolocationhandelmessage:'Location information is unavailable.',
                    snackbarOpen: true
                  });
                  break;
              case error.TIMEOUT:
                  this.setState({
                    geolocationhandelmessage:'The request to get user location timed out.',
                    snackbarOpen: true
                  });
                  break;
              case error.UNKNOWN_ERROR:
                  this.setState({
                    geolocationhandelmessage:'An unknown error occurred.',
                    snackbarOpen: true
                  });
                  break;
              default:
                this.setState({
                    geolocationhandelmessage:'An unknown error occurred.',
                    snackbarOpen: true
                });
          }
        });
    } else {
        this.setState({
            geolocationhandelmessage:'Geolocation is not supported by this browser.',
            snackbarOpen: true
        });
    }
  }
  componentDidMount(){
    if(window.google.maps){
      this.autocomplete = new window.google.maps.places.Autocomplete(this.searchInput, {types: ['geocode']});
      this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
      this.searchInput.focus();
    }
  }
  componentWillUnmount() {
    this.autocomplete.removeListener('place_changed');
  }
  handlePlaceChanged=()=>{
    const placeinformation = this.autocomplete.getPlace();
    if(placeinformation.geometry){
      this.props.onLocationSearch(placeinformation.formatted_address);
      this.props.onGeolocationChange({
        latitude:placeinformation.geometry.location.lat(),
        longitude:placeinformation.geometry.location.lng(),
      });
    }
    
  }
	render(){
		const { classes,defaultValue,currentLanguage} = this.props;
    const {snackbarOpen,geolocationhandelmessage} = this.state
		return(
			<div>
      <Paper className={classes.root} elevation={4}>
      <Grid container spacing={24}>
      <Grid item xs={12} sm={9}>
          <TextField
          inputRef={input => (this.searchInput = input)}
          value={defaultValue}
          onChange={(event)=>this.onLocationSearch(event)}
          label={Translate[currentLanguage].Address}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={Translate[currentLanguage].EnterYourArea}
          helperText={Translate[currentLanguage].inputHelperText}
          fullWidth
          autoFocus
        />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button onClick={(event)=>this.getUserCurrentLocation(event)} fullWidth className={'bangla '+classes.button} variant="raised" color="primary">
	        {Translate[currentLanguage].MyCurrentLocationBtn}
	        <Icon className={classes.rightIcon}>my_location</Icon>
	      </Button>
        </Grid>
      </Grid>
        
      </Paper>
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={snackbarOpen}
          onClose={this.handleSnackbarClose}
          autoHideDuration={5000}
          message={<span>{geolocationhandelmessage}</span>}
        />
    </div>
		)
	}
}
export default withStyles(styles)(LocationSearch);