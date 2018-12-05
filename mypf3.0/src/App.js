import React, { Component } from 'react';
import 'whatwg-fetch';
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

// import {get} from './api/serverapi'

import PropTypes from 'prop-types';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      confirmInfo: {},
      peopleandPriceandTitle: [], //给confirmation用 有 count price title
      peopleandTitle: {}, //给confirmation用
      nextstate: false,
      afterFirstConfirm: false,
      promotionTitle: ''
    };
    this.handlePackageid = this.handlePackageid.bind(this);
    this.handleSelectedDate = this.handleSelectedDate.bind(this);
    this.handleTimeslotId = this.handleTimeslotId.bind(this);
    this.peopleandPrice = this.peopleandPrice.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleFirstConfirm = this.handleFirstConfirm.bind(this);
    this.handlePromotionTitle = this.handlePromotionTitle.bind(this);
  }
  componentDidMount(){
    fetch('../localData/dealStepTwo.json')
    .then(res => res.json())
    .then( data => {
      this.setState({
        packages: data.packages,
        questions: data.questions,
        promotionList: data.promotions,
        confirmInfo: {
          optIn: data.optIn,
        }
      })}
    )
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
  handleConfirmInfo = (key, value) => {
    const tmpConfirmInfo = this.state.confirmInfo
    tmpConfirmInfo[key] = value
    this.setState({
      confirmInfo: tmpConfirmInfo
    })
  }

  //接收子传父的peopleandprice
  peopleandPrice(pp){
    console.log(pp);
    // this.state.peopleandPrice = pp;
    this.setState({peopleandPrice: pp, quantityContral: pp.number},function(){
      for(let i = 0; i<this.state.peopleandPrice.number.length; i++){
        this.state.peopleandTitle.count = this.state.peopleandPrice.number[i];
        this.state.peopleandTitle.price = this.state.peopleandPrice.price[i];
        this.state.peopleandTitle.title = this.state.peopleandPrice.title[i];
        this.state.peopleandPriceandTitle[i] = this.state.peopleandTitle;
      }
      console.log(this.state.peopleandPriceandTitle);
    });
  }

  //接收promotion里的title
  handlePromotionTitle(promotionTitle){
    this.setState({promotionTitle: promotionTitle},function(){
      console.log(this.state.promotionTitle);
    });
  }

  showConfirmation = () => {
    const tmpPromotionItem = {
      "id": 53,
      "type": "percentage",
      "value": 11,
      "title": "30% OFF UPON $200 OR ABOVE",
      "message": "Enjoy 20% off upon purchase of $200 or above",
      "conditions": {
        "price_total": {
          "minimum": "200"
        }
      }
    }

    tmpPromotionItem.ratio = tmpPromotionItem.title.slice(0, tmpPromotionItem.title.indexOf('%'))
    const tmpConfirmInfo = this.state.confirmInfo
    tmpConfirmInfo.promotionItem = tmpPromotionItem
    tmpConfirmInfo.priceInfo = {
      currency: "HKD",
      dealItems: [
        {
          title: 'adult',
          price: 50,
          count: 5,
        },
        {
          title: 'child/senior',
          price: 40,
          count: 3,
        }
      ]
    }
    this.setState({
      confirmInfo: tmpConfirmInfo,
    })
  }
  //接收bottombutton传过来的值 用于显示userinformation questionlist promotion list
  handleNext(flag){
    this.showConfirmation();
    this.setState({
      nextstate: flag
    })
  }

  handleFirstConfirm(flag){
    this.showConfirmation()
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
    if(this.state.packages !== undefined){  
       selectIdPackage = this.state.packages.find(function(ele){
        return ele.id === that.state.packageid;
      })
      if(selectIdPackage !== undefined){
        if(selectIdPackage.dates.length>0){
          selectIdPackageDateLength = selectIdPackage.dates.length;      
          for(let i =0; i<selectIdPackage.dates.length; i++){
            if(this.state.selectedDate === selectIdPackage.dates[i].date.substring(8,10)){
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
    
    if(this.state.promotionList !== undefined){
      promotionList = this.state.promotionList;
    }
    
    return (
      <div>
        {/* <SelectPackage /> */}
        <PackageRadio packages={this.state.packages} onChangePackage={this.handlePackageid}/>
        {/* <SelectTime /> */}
        {selectIdPackageDateLength>0 && <DatePicker packages={selectIdPackage} onChangeHandledates={this.handleSelectedDate} onChangeTimeslotId={this.handleTimeslotId}/>}      
        {(quantityDisplay || selectIdPackageDateLength ==0) && <Quantity dealitemTypes={dealitemTypes} timeslotId={this.state.timeslotId} handlepeopleandPrice={this.peopleandPrice}/>}
        {this.state.nextstate && <Userdetails getUserInfo={this.handleConfirmInfo}/>}
        {this.state.nextstate && this.state.questions &&
          <QuestionList
            questions={ this.state.questions }
            timeslotId={ this.state.timeslotId }
            packageId={ this.state.packageid }
            getQuestionListAnswers={this.handleConfirmInfo}/>
        }
        {this.state.nextstate && <Promotionlist promotionList={promotionList} peopleandprice={this.state.peopleandPrice} onHandlePromotionTitle={this.handlePromotionTitle}/>}
        {this.state.afterFirstConfirm && <Confirmation confirmInfo={this.state.confirmInfo}/>}
        {/* <PaymentMethod /> */}
        <BottomButton quantityContral={this.state.quantityContral} onHandleNext={this.handleNext} onHandleFirstConfirm={this.handleFirstConfirm} verifyUserInf={this.state.confirmInfo}/>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default App;
