import React, { Component } from 'react';

import styles from './styles'
import Translate from '../../language/language';
import nophoto from '../../assets/images/nophotos.png'; 
import moment from 'moment';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import { LinearProgress } from 'material-ui/Progress';
import List, { ListItem, ListItemText,ListSubheader} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

class NearestMasjid extends Component{
	constructor(props){
		super(props);
		this.state = {
	      prayertimesdata: false,
	      prayerlocationdata: false,
	      dialogopen:false,
	      selectedlocation:false,
	      travelmode:'DRIVING'
	    };
	    this.googlemapcontainer = React.createRef();
	}
	componentDidMount() {
		const {geolocation} = this.props;
		if(geolocation){
			this.fetchPrayerTimedata(geolocation);
			this.fetchNearestPrayerLocation(geolocation);
		}
		if(window.google.maps){
			this.directionsService = new window.google.maps.DirectionsService();
			this.directionsDisplay = new window.google.maps.DirectionsRenderer();
		}
		
	}
	handleDialogClose=()=>{
		this.setState({dialogopen: false });
	}
	Transition=(props)=>{
		return <Slide direction="up" {...props} />;
	}
	handleChange=(event)=>{
		this.setState({ travelmode: event.target.value});
		this.setState({ title: event.target.value }, () => this.travelModeReDraw());
	}
	openInformationDialog=(event,locationdata)=>{
		this.setState({ dialogopen: true, selectedlocation:locationdata});	
	}
	facebookshare=(event,locationdata)=>{
		let window_size = "width=585,height=368";
    	let _url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.google.com/maps/search/?api=1&query=${locationdata.geometry.location.lat()},${locationdata.geometry.location.lng()}`)}`;
    	window.open(_url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,' + window_size);
	}
	DialogonEntered=()=>{
		const {selectedlocation}=this.state;
		const {geolocation} = this.props;
		const selectedAddress=new window.google.maps.LatLng(selectedlocation.geometry.location.lat(), selectedlocation.geometry.location.lng());
		const userAddress=new window.google.maps.LatLng(geolocation.latitude,geolocation.longitude);
		if(window.google.maps){
	        var map = new window.google.maps.Map(this.googlemapcontainer.current, {
	          zoom: 16,
	          center: selectedAddress
	        });
	        this.directionsDisplay.setMap(map);
	        this.travelModeReDraw();
	        var bounds = new window.google.maps.LatLngBounds();
		    bounds.extend(selectedAddress);
		    bounds.extend(userAddress);
		    map.fitBounds(bounds);
		}
	}
	travelModeReDraw=()=>{
		const {selectedlocation,travelmode}=this.state;
		const {geolocation} = this.props;
		const selectedAddress=new window.google.maps.LatLng(selectedlocation.geometry.location.lat(), selectedlocation.geometry.location.lng());
		const userAddress=new window.google.maps.LatLng(geolocation.latitude,geolocation.longitude);
		this.directionsService.route({
          origin: userAddress,
          destination: selectedAddress,
          travelMode: travelmode
        }, (response, status)=>{
        	console.log(response, status);
          if (status === 'OK') {
            this.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
	}
	fetchPrayerTimedata=(geolocation)=>{
		fetch(`https://api.aladhan.com/v1/timings/${Math.round((new Date()).getTime() / 1000)}?latitude=${geolocation.latitude}&longitude=${geolocation.longitude}&method=2`)
	      .then(res => res.json())
	      .then(
	        (result) => {
	        	this.setState({
		            prayertimesdata:result.data.timings
		        });
	        },
	        (error) => {
	          console.log(error)
	        }
	      )
	}
	fetchNearestPrayerLocation=(geolocation)=>{
		var request = {
		location: {lat: geolocation.latitude, lng: geolocation.longitude},
	    radius: '1500',
	    type: ['mosque']
	  };
		const service = new window.google.maps.places.PlacesService(document.createElement('div'));
  		service.nearbySearch(request, (results, status)=>{
		  	this.setState({
	            prayerlocationdata:results
	        });
		});

	}
	componentDidUpdate(prevProps, prevState, snapshot){
		const {geolocation} = this.props;
		if(geolocation.latitude !== prevProps.geolocation.latitude){
			this.fetchPrayerTimedata(geolocation);
			this.fetchNearestPrayerLocation(geolocation);
		}
	}
	ifPlaceHasPhotos=(locationdata)=>{
		const { classes} = this.props;
		if (locationdata.hasOwnProperty('photos')) {
			const photo=locationdata.photos[0];
		  return (
		  	<CardMedia
			    className={classes.media}
			    image={photo.getUrl({'maxWidth': 345, 'maxHeight': 194})}
			    title={locationdata.name}
			  />
		  )
		}
		return (
		  	<CardMedia
			    className={classes.media}
			    image={nophoto}
			    title={'default image'}
			  />
		  )
	}
	renderRatingUI=(locationdata)=>{
		let roundRating=Math.round(locationdata.rating);
		if(roundRating){
			return Array(roundRating).fill().map((empty,index)=><Icon style={{ color: '#FFBC00' }} key={index}>star_rate </Icon>);
		}return null;
	}
	renderPrayerLocations=()=>{
		const { classes,currentLanguage} = this.props;
		const {prayerlocationdata}=this.state;
		if(prayerlocationdata){
			const renderui=prayerlocationdata.map((locationdata)=>{
				return (
					<Grid key={locationdata.place_id} item xs={12} sm={4}>
					<Card>
					  <CardHeader
					    avatar={
					      <Avatar alt={locationdata.name} src={locationdata.icon} aria-label="Recipe">
					        
					      </Avatar>
					    }
					    title={locationdata.name}
					    subheader={this.renderRatingUI(locationdata)}
					  />
					  {this.ifPlaceHasPhotos(locationdata)}
					  <CardContent>
					    <Typography component="p">
					      {locationdata.vicinity}

					    </Typography>
					  </CardContent>
					  <CardActions className={classes.actions} disableActionSpacing>
					  <Button className={'bangla'} onClick={(event)=>this.openInformationDialog(event,locationdata)} color="primary">
			             <Icon>place</Icon> {Translate[currentLanguage].getdirections}
			          </Button>
					    
					    <IconButton onClick={(event)=>this.facebookshare(event,locationdata)} aria-label="Share">
					      <Icon>share</Icon>
					    </IconButton>
					  </CardActions>
					</Card>
				</Grid>
				)
			})
			return (
				<div className={classes.marginTop}>
				<Grid container spacing={24}>
					{renderui}
				</Grid>
				</div>
			)
		}else{
			return(
				<Paper className={'bangla '+classes.root} elevation={4}>
			        <Typography className={'bangla'} variant="headline" component="h3">
			          {Translate[currentLanguage].SearchingNearestMosque} {this.props.currentLocation}
			        </Typography>
			        <LinearProgress />
			      </Paper>
			)
		}
	}
	renderPrayerTimedata=()=>{
		const { classes,currentLanguage} = this.props;
		const {prayertimesdata}=this.state;
		if(prayertimesdata){
			const renderui = Object.keys(prayertimesdata).map((key)=>{
			    return (
			    	<ListItem key={key}>
			          <Avatar>
			          <Icon>
				        access_time
				      </Icon>
			          </Avatar>
			          <ListItemText primary={
			          	<span className={'bangla'}>
            				{Translate[currentLanguage][key]}
            			</span>
			          } secondary={moment(prayertimesdata[key], "HH:mm").format('h:mm a')} />
			        </ListItem>
			    )
			});
        	return (
        		<Paper className={classes.root} elevation={4}>
			        <List
			        	subheader={<ListSubheader className={'bangla'}>{Translate[currentLanguage].Namaztime}</ListSubheader>}
			        >
			        {renderui}
			      </List>
		      </Paper>
      		)
		}else{
		return (
				<Paper className={classes.root} elevation={4}>
			        <Typography className={'bangla'} variant="headline" component="h3">
			          {Translate[currentLanguage].Namaztime} {this.props.currentLocation}
			        </Typography>
			       <LinearProgress />
			     </Paper>
			)	
		}
		
	}
	renderDialogContent=()=>{
		return(
			<div
				ref={this.googlemapcontainer}
					style={{width:'100%',height:'100%'}}
				>
			</div>
		)
	}
	render(){
		const { classes} = this.props;
		const {dialogopen,selectedlocation}=this.state;
		return(
			<div>
			<Grid container spacing={24}>
			<Grid item xs={12} sm={9}>
				{this.renderPrayerLocations()}
			</Grid>
			<Grid item xs={12} sm={3}>
				{this.renderPrayerTimedata()}
			</Grid>
			</Grid>
	        <Dialog
	          fullScreen
	          open={dialogopen}
	          onClose={this.handleDialogClose}
	          transition={this.Transition}
	          onEntered={this.DialogonEntered}
	        >
	          <AppBar className={classes.appBar}>
	            <Toolbar>
	              <IconButton color="inherit" onClick={this.handleDialogClose} aria-label="Close">
	                <Icon>close</Icon>
	              </IconButton>
	              <Typography variant="title" color="inherit" className={classes.flex}>
	                {selectedlocation.name}
	              </Typography>
	              <FormControl className={classes.formControl}>

	              <InputLabel style={{color:'white'}} >Mode of Travel</InputLabel>
	              <Select
	              style={{color:'white'}}
            value={this.state.travelmode}
            onChange={this.handleChange}
            inputProps={{
              name: 'travelmode',
            }}
          >
            <MenuItem value={'DRIVING'}>Driving</MenuItem>
            <MenuItem value={'WALKING'}>Walking</MenuItem>
            <MenuItem value={'TRANSIT'}>Transit</MenuItem>
            
          </Select>
          </FormControl>
	              <Button color="inherit" onClick={(event)=>this.facebookshare(event,selectedlocation)}>
	                SAHRE
	              </Button>
	            </Toolbar>
	          </AppBar>
	          {this.renderDialogContent()}
	        </Dialog>
			</div>
		)
	}
}
export default withStyles(styles)(NearestMasjid);
