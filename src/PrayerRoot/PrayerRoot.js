import React, { Component } from 'react';
import './PrayerRoot.css';
import styles from './styles'

import LocationSearch from '../components/LocationSearch/LocationSearch';
import PrayerTime from '../components/PrayerTime/PrayerTime';
import NearestMasjid from '../components/NearestMasjid/NearestMasjid';
import Translate from '../language/language';
import moment from 'moment';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Hidden from 'material-ui/Hidden';

class PrayerRoot extends Component {
	constructor(props){
		super(props);
		this.state={
			mobileOpen: false,
			activepage:'NearestMasjid',
			currentlocation:'',
			geolocation:{
				latitude:23.7341698,
				longitude:90.39275020000002
			},
			defaultlanguage:'bn',
			localclock:moment().format('MMMM Do YYYY h:mm:ss a'),
		}
	}
	componentDidMount(){
		this.triggerClockRun();
	}
	componentWillUnmount() {
	    clearInterval(this.clockTimerID);
	}
	triggerClockRun=()=>{
		this.clockTimerID = setInterval(()=>{
			this.setState({
		      localclock: moment().format('MMMM Do YYYY h:mm:ss a')
		    });
		},1000)
	}
	handleDrawerToggle = () => {
	    this.setState({ mobileOpen: !this.state.mobileOpen });
	}
	handleLocationChange=(locationinformation)=>{
		this.setState({currentlocation:locationinformation});
	}
	handleGeolocationChange=(locationinformation)=>{
		this.setState({geolocation:locationinformation});
	}
	changeCurrentPage=(event,componentto)=>{
		this.setState({activepage:componentto});
	}
	changeCurrentLanguage=(event,componentto)=>{
		this.setState({defaultlanguage:componentto});
	}
	githubLink=(event)=>{
		window.open('https://github.com/sanidkpc/prayer','_blank');
	}
	isActivated=(componentfor)=>{
		return this.state.activepage === componentfor? this.props.classes.active:'';
	}
	isActiveLanguage=(componentfor)=>{
		return this.state.defaultlanguage === componentfor? this.props.classes.active:'';
	}
	render(){
		const { classes } = this.props;
		const {activepage,currentlocation,geolocation,defaultlanguage,localclock} = this.state;
		const drawerMenu = (
	      <div>
	        <div className={classes.toolbar} />
	        <List component="nav">
	        	<ListItem
				onClick={(event)=>this.changeCurrentPage(event,'NearestMasjid')}
				button
				className={'bangla '+this.isActivated('NearestMasjid')}
				>
				  <ListItemIcon>
				  <Icon>track_changes</Icon>
				  </ListItemIcon>
				  <ListItemText
            		primary={
            			<span className={'bangla'}>
            				{Translate[defaultlanguage].NearestMasjid}
            			</span>
            		} />
				</ListItem>
				<ListItem
				onClick={(event)=>this.changeCurrentPage(event,'PrayerTime')}
				button
				className={'bangla '+this.isActivated('PrayerTime')}
				>
				  <ListItemIcon>
					<Icon>
				        schedule
				      </Icon>
				  </ListItemIcon>
				  <ListItemText className='bangla' primary={
				  	<span className={'bangla'}>
            			{Translate[defaultlanguage].PrayerTimeCalendar}
            		</span>
				  } />
				</ListItem>

				<ListItem
				onClick={(event)=>this.githubLink(event)}
				button
				>
				  <ListItemIcon>
					<Icon>
				        link
				      </Icon>
				  </ListItemIcon>
				  <ListItemText primary={'GitHub repo'} />
				</ListItem>
			  </List>
	      </div>
	    );

		return(
			<div className={classes.root}>
		        <AppBar className={classes.appBar}>
		          <Toolbar>
		            <IconButton
		              color="inherit"
		              aria-label="open drawer"
		              onClick={this.handleDrawerToggle}
		              className={classes.navIconHide}
		            >
		              <Icon>menu</Icon>
		            </IconButton>
		            <Typography className={'bangla '+classes.flex} variant="title" color="inherit" noWrap>
		              {Translate[defaultlanguage].headerTitle} | {currentlocation} | {localclock}
		            </Typography>
		            <Button 
		            	onClick={(event)=>this.changeCurrentLanguage(event,'bn')}
		            	className={'bangla '+this.isActiveLanguage('bn')} color="inherit">
		            	বাংলা
		            </Button>
		            <Button 
		            	onClick={(event)=>this.changeCurrentLanguage(event,'en')}
		            	className={this.isActiveLanguage('en')} color="inherit">
		            	EN
		            </Button>
		          </Toolbar>
		        </AppBar>
		        <Hidden mdUp>
		          <Drawer
		            variant="temporary"
		            
		            open={this.state.mobileOpen}
		            onClose={this.handleDrawerToggle}
		            classes={{
		              paper: classes.drawerPaper,
		            }}
		            ModalProps={{
		              keepMounted: true, // Better open performance on mobile.
		            }}
		          >
		            {drawerMenu}
		          </Drawer>
		        </Hidden>
		        <Hidden smDown implementation="css">
		          <Drawer
		            variant="permanent"
		            open
		            classes={{
		              paper: classes.drawerPaper,
		            }}
		          >
		            {drawerMenu}
		          </Drawer>
		        </Hidden>
		        <main className={classes.content}>
		          <div className={classes.toolbar} />
		          <LocationSearch
		          			currentLanguage={defaultlanguage}
				        	defaultValue={currentlocation}
				        	onLocationSearch={this.handleLocationChange}
				        	onGeolocationChange={this.handleGeolocationChange}
				        />
				        {activepage === 'PrayerTime' && 
				        	<PrayerTime
				        		currentLanguage={defaultlanguage}
				        		geolocation={geolocation}
				        		currentLocation={currentlocation}
				        	/>
				    	}
				        {activepage === 'NearestMasjid' && 
				        	<NearestMasjid
				        		currentLanguage={defaultlanguage}
				        		geolocation={geolocation}
				        		currentLocation={currentlocation}
				        	/>
				    	}
		        </main>
      		</div>
		)
	}
}
export default withStyles(styles)(PrayerRoot);