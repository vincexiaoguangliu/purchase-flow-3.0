import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../App.css';

//time slot
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },

});

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            currentIndex: 0
        }
    }
    
    handleClick(event) {
        this.setState({
            currentIndex: parseInt(event.currentTarget.getAttribute('index')),
            // selectedDate: event.currentTarget.getAttribute('value')
        });
        this.props.onHandleDate(event.currentTarget.getAttribute('value'));
        
       
    }
    
    render() {
       
        const week = ["Sun", "Mon", "Tue", "Wed", "Tur", "Fri", "Sat"];
        const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        const now = new Date();
        const items = numbers.map((i) => {
            const date = new Date(+now + i * 3600 * 1000 * 24).getDate();
            const day = new Date(+now + i * 3600 * 1000 * 24).getDay();
            return (<li id="item">
                <p>{week[day]}</p>
                <p onClick={this.handleClick} key={i} value={date < 10? '0'+date:date} index={i} className={this.state.currentIndex === i ? 'current' : ''}>{date < 10? '0'+date:date}</p>
            </li>)
        });
        return (
            items
        )
    }
}
class DatePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.handleDate = this.handleDate.bind(this);
        this.handleTimaslotId = this.handleTimaslotId.bind(this);
    }
    handleDate(date){
        this.setState({
            selectDate: date,
        });
        this.props.onChangeHandledates(date);
        
    }
    handleTimaslotId(event){
        this.props.onChangeTimeslotId(event.currentTarget.getAttribute('value'))
    }
    render() {
        console.log(this.state.selectDate);
        let pickDate = this.state.selectDate;
        let timeslotTittle = [];
        if(this.props.packages != undefined){
            // console.log(this.props.packages.dates);
            for(let i = 0; i<this.props.packages.dates.length; i++){
                if(pickDate == this.props.packages.dates[i].date.substring(8,10)){
                    // console.log(this.props.packages.dates[i].timeslots);
                    timeslotTittle = this.props.packages.dates[i].timeslots;                   
                }
            }
        }  
        const { classes } = this.props;
        const week = ["Sun", "Mon", "Tue", "Wed", "Tur", "Fri", "Sat"];
        const Month = ['Dec', 'Jan', 'Fre', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
        const now = new Date();
        const day = now.getDay();
        const date = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        
        let that = this;
        return (          
            <div id="datepicker">
                <div className='sectionHeader'>SELECT DATE Today is{week[day]},{date} {Month[month]} {year}</div>
                <div className="overflow">
                    <div className='datePickerHead'>{Month[month]} {year}</div>
                    <div className="calendar">
                        <ul className="list">
                            <Calendar  onHandleDate={this.handleDate}/>
                        </ul>
                    </div>
                </div>
                {timeslotTittle.length>0 && <div className='sectionHeader'>SELECT TIME</div>}
                {timeslotTittle.length>0 && 
                    <div style={{width:'100%', overflow:'hidden', height: 50}}>
                        <div style={{width:'100%',height: 58, overflowX:'auto'}}>
                            <div style={{width:915, overflow:'hidden', height:'100%'}}>
                                {   
                                    timeslotTittle.map(function (ele, index) {
                                        return (                          
                                            <Button key={index} value={ele.id} variant="outlined" onClick={that.handleTimaslotId} className={classes.button}>
                                                {ele.title}
                                            </Button>    
                                        )
                                    })                  
                                }
                            </div>
                        </div>
                    </div>
                }
                
            </div>

        );
    }
}
DatePicker.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DatePicker);;