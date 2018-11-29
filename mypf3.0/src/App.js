import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import logo from './logo.svg';
import './App.css';

import Quantity from './pfComponent/quantity'
import Userdetails from './pfComponent/userDetails'
import QuestionList from './pfComponent/questionList'
import Promotionlist from './pfComponent/promotionList'
import Confirmation from './pfComponent/confirmation'
import PaymentMethod from './pfComponent/paymentMethod'
import BottomButton from './pfComponent/bottomButton'
// import SelectPackage from './pfComponent/package'
import PackageRadio from './pfComponent/packageRadio'
import DatePicker from './pfComponent/datePicker'
import SelectTime from './pfComponent/selectTime'

// import {get} from './api/serverapi'

import PropTypes from 'prop-types';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {};
    this.handlePackageid = this.handlePackageid.bind(this);
    this.handleSelectedDate = this.handleSelectedDate.bind(this);
    this.handleTimeslotId = this.handleTimeslotId.bind(this);
  }
  componentDidMount(){
    fetch('../localData/dealStepTwo.json')
    .then(res => res.json())
    .then( data => {this.setState({
      packages: data.packages,
      questions: data.questions,
    })})
  }

  handlePackageid(packageid){
    this.setState({
      packageid: packageid
    })
  }
  handleSelectedDate(date){
    this.setState({
      selectedDate: date
    })
  }
  //子(datepicker)传父获取timeslotId
  handleTimeslotId(id){
    this.setState({
      timeslotId: id
    })
  }
  render() {
    let that = this;
    let selectIdPackage;
    let dealitemTypes;
    let quantityDisplay;
    //判断quantity显现
    if(this.state.timeslotId){ 
      quantityDisplay = true;
    }
    // console.log(this.state.timeslotId);
    //父组件传select quantity  dealitemTypes；
    if(this.state.packages != undefined){  
       selectIdPackage = this.state.packages.find(function(ele){
        return ele.id == that.state.packageid;
      })
      if(selectIdPackage != undefined){
        if(selectIdPackage.dates.length>0){
          
          for(let i =0; i<selectIdPackage.dates.length; i++){
            if(this.state.selectedDate == selectIdPackage.dates[i].date.substring(8,10)){
              console.log(selectIdPackage.dates[i].dealItemTypes);
              dealitemTypes = selectIdPackage.dates[i].dealItemTypes;
            }
          }
        }else{
          dealitemTypes = selectIdPackage.dealItemTypes;
        }  
      }     
    }
    
    return (
      <div>
        {/* <SelectPackage /> */}
        <PackageRadio packages={this.state.packages} onChangePackage={this.handlePackageid}/>
        <DatePicker packages={selectIdPackage} onChangeHandledates={this.handleSelectedDate} onChangeTimeslotId={this.handleTimeslotId}/>
        {/* <SelectTime /> */}
        {quantityDisplay && <Quantity dealitemTypes={dealitemTypes} timeslotId={this.state.timeslotId}/>}
        <Userdetails />
        {this.state.questions && <QuestionList questions = { this.state.questions }/>}
        <Promotionlist />
        <Confirmation />
        <PaymentMethod />
        <BottomButton />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default App;
