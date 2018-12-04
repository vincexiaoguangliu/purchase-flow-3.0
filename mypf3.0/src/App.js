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
    this.state = {
      // peopleandPrice: {}
      nextstate: false,
      afterFirstConfirm: false
    };
    this.handlePackageid = this.handlePackageid.bind(this);
    this.handleSelectedDate = this.handleSelectedDate.bind(this);
    this.handleTimeslotId = this.handleTimeslotId.bind(this);
    this.peopleandPrice = this.peopleandPrice.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleFirstConfirm = this.handleFirstConfirm.bind(this);
  }
  componentDidMount(){
    fetch('../localData/dealStepTwo.json')
    .then(res => res.json())
    .then( data => {this.setState({
      packages: data.packages,
      questions: data.questions,
      promotionList: data.promotions,
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

  // 获取 questionList answers
  handleQuestionAnswers = (answers) => {
    this.setState({
      answers: answers
    })
    console.log(answers, 25555555555)
  }

  //接收子传父的peopleandprice
  peopleandPrice(pp){
    console.log(pp);
    // this.state.peopleandPrice = pp;
    this.setState({peopleandPrice: pp, quantityContral: pp.number});
    console.log(this.state.peopleandPrice);
  }

  //接收bottombutton传过来的值 用于显示userinformation questionlist promotion list
  handleNext(flag){
    this.setState({
      nextstate: flag
    })
  }

  handleFirstConfirm(flag){
this.setState({
  afterFirstConfirm: flag
})
  }
  render() {
    let that = this;
    let selectIdPackage;
    let dealitemTypes;
    let quantityDisplay;
    let selectIdPackageDateLength; //通过判断date.length判断日期的显示
    let promotionList = [];
    //判断quantity显现
    if(this.state.timeslotId){ 
      quantityDisplay = true;
    }
    // console.log(this.state.timeslotId);
    //父组件传select quantity子组件 dealitemTypes属性；
    if(this.state.packages != undefined){  
       selectIdPackage = this.state.packages.find(function(ele){
        return ele.id == that.state.packageid;
      })
      if(selectIdPackage != undefined){
        if(selectIdPackage.dates.length>0){
          selectIdPackageDateLength = selectIdPackage.dates.length;      
          for(let i =0; i<selectIdPackage.dates.length; i++){
            if(this.state.selectedDate == selectIdPackage.dates[i].date.substring(8,10)){
              console.log(selectIdPackage.dates[i].dealItemTypes);
              dealitemTypes = selectIdPackage.dates[i].dealItemTypes;
            }
          }
        }else{
          selectIdPackageDateLength = 0;
          dealitemTypes = selectIdPackage.dealItemTypes;
        }  
      }     
    }
    
    if(this.state.promotionList != undefined){
      promotionList = this.state.promotionList;
    }
    
    return (
      <div>
        {/* <SelectPackage /> */}
        <PackageRadio packages={this.state.packages} onChangePackage={this.handlePackageid}/>
        {/* <SelectTime /> */}
        {selectIdPackageDateLength>0 && <DatePicker packages={selectIdPackage} onChangeHandledates={this.handleSelectedDate} onChangeTimeslotId={this.handleTimeslotId}/>}      
        {(quantityDisplay || selectIdPackageDateLength ==0) && <Quantity dealitemTypes={dealitemTypes} timeslotId={this.state.timeslotId} handlepeopleandPrice={this.peopleandPrice}/>}
        {this.state.nextstate && <Userdetails />}
       
        {this.state.nextstate && (this.state.questions && this.state.timeslotId && this.state.packageid &&
          <QuestionList 
            questions={ this.state.questions } 
            timeslotId={ this.state.timeslotId }
            packageId={ this.state.packageid }
            getQuestionListAnswers={this.handleQuestionAnswers}/>
        )}
        {this.state.nextstate && <Promotionlist promotionList={promotionList} peopleandprice={this.state.peopleandPrice}/>}       
        {this.state.afterFirstConfirm && <Confirmation />}       
        {/* <PaymentMethod /> */}
        <BottomButton quantityContral={this.state.quantityContral} onHandleNext={this.handleNext} onHandleFirstConfirm={this.handleFirstConfirm}/>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default App;
