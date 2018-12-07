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

// request
import request from './api/request';

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
    this.dealStepData = {};
  }
  async getDealStepInfo() {
    try {
      // const urlPar = {
      //   notice_type: 1,
      //   limit: 8,
      //   page: 1,
      // };
      // const todayOnHistoryInfo = await request.test(urlPar);
      // console.log(todayOnHistoryInfo, 23333)

      this.dealStepData = await request.getDealStepInfo({}, 1051)
      
      console.log(this.dealStepData, 23333)
    } catch (e) {
      console.log(e)
    }
  }

  componentDidMount(){
    console.log(88888888)
    // fetch('../localData/dealStepTwo.json')
    // .then(res => res.json())
    // .then( data => {
    //   this.setState({
    //     packages: data.packages,
    //     questions: data.questions,
    //     promotionList: data.promotions,
    //     // confirmation info 需要的数据都在 confirmInfo 对象中
    //     confirmInfo: {
    //       optIn: data.optIn,
    //     }
    //   })}
    // )

    this.setState({
      packages: this.dealStepData.packages,
      questions: this.dealStepData.questions,
      promotionList: this.dealStepData.promotions,
      // confirmation info 需要的数据都在 confirmInfo 对象中
      confirmInfo: {
        optIn: this.dealStepData.optIn,
      }
    })

    // fetch('https://staging.handy.travel/v2/deals/1024/dealstep')
    // .then(res => res.json())
    // .then( data => {
    //   // this.setState({
    //   //   packages: data.packages,
    //   //   questions: data.questions,
    //   //   promotionList: data.promotions,
    //   //   // confirmation info 需要的数据都在 confirmInfo 对象中
    //   //   confirmInfo: {
    //   //     optIn: data.optIn,
    //   //   }
    //   // })}
    //   console.log(data, 26666)
    // }
    // )

    this.getDealStepInfo()
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
    if (key === 'packageInfo') {
      this.setState({
        packageid: value.id
      })
    }
  }

  //接收子传父的peopleandprice
  peopleandPrice(pp){
    // this.state.peopleandPrice = pp;
    this.setState({peopleandPrice: pp, quantityContral: pp.number});
    let peopleAndPrice = []
    setTimeout(() => {
      for (let i = 0; i < pp.number.length; i++) {
        peopleAndPrice.push({
          title: pp.title[i],
          price: pp.price[i],
          count: pp.number[i],
        })
      }
      this.handleConfirmInfo('priceInfo', peopleAndPrice)
    }, 0)
  }

  //接收promotion里的title
  handlePromotionTitle(promotionTitle){
    this.setState({promotionTitle: promotionTitle},function(){
      console.log(this.state.promotionTitle, 233333);
    });
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
        <PackageRadio packages={this.state.packages} getPackageInfo={this.handleConfirmInfo}/>
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
        {this.state.nextstate && <Promotionlist promotionList={promotionList} peopleandprice={this.state.peopleandPrice} onHandlePromotionTitle={this.handleConfirmInfo}/>}
        {this.state.afterFirstConfirm && <Confirmation confirmInfo={this.state.confirmInfo} getCheckedInfo={this.handleConfirmInfo}/>}
        <BottomButton quantityContral={this.state.quantityContral} onHandleNext={this.handleNext} onHandleFirstConfirm={this.handleFirstConfirm} verifyUserInf={this.state.confirmInfo}/>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default App;
