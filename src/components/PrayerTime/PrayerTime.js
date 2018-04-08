import React, { Component } from 'react';
import styles from './styles';
import moment from 'moment';
import Translate from '../../language/language';

import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';


class PrayerTime extends Component{
	constructor(props){
		super(props);
		this.state={
			prayercalendartimesdata:false
		}
	}
	componentDidMount() {
		const {geolocation} = this.props;
		if(geolocation){
			this.fetchPrayerCalendarTimedata(geolocation);
		}
	}
	fetchPrayerCalendarTimedata=(geolocation)=>{
		fetch(`https://api.aladhan.com/v1/calendar?latitude=${geolocation.latitude}&longitude=${geolocation.longitude}&method=2&month=${moment().month()+1}&year=${moment().year()}`)
	      .then(res => res.json())
	      .then(
	        (result) => {
	        	this.setState({
		            prayercalendartimesdata:result.data
		        });
	        },
	        (error) => {
	          console.log(error)
	        }
	      )
	}
	componentDidUpdate(prevProps, prevState, snapshot){
		const {geolocation} = this.props;
		if(geolocation.latitude !== prevProps.geolocation.latitude){
			this.fetchPrayerCalendarTimedata(geolocation);
		}
	}
	renderPrayerCalenderTime=()=>{
		const { classes,currentLanguage} = this.props;
		const {prayercalendartimesdata}=this.state;
		const isCurrentDate=(date)=>{
			if(moment().diff(moment(date,'DD-MM-YYYY'), 'days') === 0){
				return classes.todayrow;
			}
			return classes.row;
		}
		if(prayercalendartimesdata){
			return(
				<Paper className={classes.root}>
			      <Table>
			        <TableHead>
			          <TableRow className={'bangla '+classes.tableheaderstyle}>
			            <TableCell>{Translate[currentLanguage].Date}</TableCell>
			            <TableCell>{Translate[currentLanguage].Fajr}</TableCell>
			            <TableCell>{Translate[currentLanguage].Dhuhr}</TableCell>
			            <TableCell>{Translate[currentLanguage].Asr}</TableCell>
			            <TableCell>{Translate[currentLanguage].Maghrib}</TableCell>
			            <TableCell>{Translate[currentLanguage].Isha}</TableCell>
			          </TableRow>
			        </TableHead>
			        <TableBody>
			          {prayercalendartimesdata.map((calendardata,index) => {
			            return (
			              <TableRow className={isCurrentDate(calendardata.date.gregorian.date)} key={index}>
			                <TableCell>{calendardata.date.readable}</TableCell>
			                <TableCell>{calendardata.timings.Fajr}</TableCell>
			                 <TableCell>{calendardata.timings.Dhuhr}</TableCell>
			                <TableCell>{calendardata.timings.Asr}</TableCell>
			                <TableCell>{calendardata.timings.Maghrib}</TableCell>
			                <TableCell>{calendardata.timings.Isha}</TableCell>
			              </TableRow>
			            );
			          })}
			        </TableBody>
			      </Table>
			    </Paper>
			)
		}else{
			return(
				<Paper className={classes.root} elevation={4}>
			        <Typography className={'bangla'} variant="headline" component="h3">
			          {Translate[currentLanguage].PrayerTimeCalendar} {this.props.currentLocation}
			        </Typography>
			       <LinearProgress />
			     </Paper>
			)
		}
	}
	render(){
		return(
			<div>
			{this.renderPrayerCalenderTime()}
			</div>
		)
	}
}
export default withStyles(styles)(PrayerTime);
