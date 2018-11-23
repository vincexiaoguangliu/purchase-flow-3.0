import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import '../App.css';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});

class Quantity extends Component {
    constructor(props) {
        super(props);
        this.state = { number: 0 ,
                       discountprice: [],
                       Quantity: []
                    };
        // this.addQuantity = this.addQuantity.bind(this);
        this.submiteQuantity = this.submiteQuantity.bind(this);
        
    }
   
    submiteQuantity(data) {
        if (data > 0) {
            this.setState(
                {
                    number: data - 1
                }
            );
        }
    }
    
    //覆盖旧的折扣价 unitprice
    coverdiscount(newdiscountprice, index, currentQuantity){
        console.log(newdiscountprice);
        let temp1 = {...this.state.discountprice, [index]:newdiscountprice};
        let temp2 = {...this.state.Quantity, [index]:currentQuantity+1};
        this.setState({discountprice: temp1, Quantity: temp2});
        
    };
    //初始化quantity 调用render外函数 赋值到state里面去
    startQuantity(quantity){
        console.log(quantity);
        
        for(let i = 0; i<quantity.length; i++){
            this.state.Quantity[i]=quantity[i]           
        }       
    }
    render() {
       
        console.log(this.props.timeslotId);
        const { classes } = this.props;
        let transferTimaslotId = this.props.timeslotId;
        let dealitemTypes = [];//接收父组件传递过来的dealitemTypes
        let unitPrice = [];//折扣价
        let originalPrice = [];//原价
        let quantity = [];//当前数量
        let maxQuantity = [];//数量上限
        let dealItemPriceFalseArray = [];//default 为false的price 2维数组
        let meetConditionPrices = []; //满足condition的所有price
        
        let that = this;
        function addQuantity(currentQuantity,currentdiscountPrice,index,e){

            // console.log(index);
            // console.log(currentQuantity);
            // console.log(dealItemPriceFalseArray[index]); 
            // console.log(currentdiscountPrice);
            
            for(let j=0; j<dealItemPriceFalseArray[index].length; j++){
                if(dealItemPriceFalseArray[index][j].conditions.quantity && dealItemPriceFalseArray[index][j].conditions.timeslot){
                    if(((currentQuantity>=dealItemPriceFalseArray[index][j].conditions.quantity.minimum) && (currentQuantity<=dealItemPriceFalseArray[index][j].conditions.quantity.maximum)) && (transferTimaslotId == dealItemPriceFalseArray[index][j].conditions.timeslot.id)){
                        meetConditionPrices.push(dealItemPriceFalseArray[index][j]);
                    }
                }else if(dealItemPriceFalseArray[index][j].conditions.quantity){
                    if((currentQuantity>=dealItemPriceFalseArray[index][j].conditions.quantity.minimum) && (currentQuantity<=dealItemPriceFalseArray[index][j].conditions.quantity.maximum)){
                        meetConditionPrices.push(dealItemPriceFalseArray[index][j]);
                    }
                }else if(dealItemPriceFalseArray[index][j].conditions.timeslot){
                    if(transferTimaslotId == dealItemPriceFalseArray[index][j].conditions.timeslot.id){
                        meetConditionPrices.push(dealItemPriceFalseArray[index][j]);
                    }
                }
            }
            // console.log(meetConditionPrices);//为啥这里已完成priority的排序
            meetConditionPrices.sort(function(a,b){
                return a.priority - b.priority;
            })
            console.log(meetConditionPrices);
            console.log(unitPrice[index]);
            if(meetConditionPrices[meetConditionPrices.length-1].unitPrice < unitPrice[index]){
                console.log(meetConditionPrices[meetConditionPrices.length-1].unitPrice);              
                if(currentdiscountPrice > meetConditionPrices[meetConditionPrices.length-1].unitPrice){
                    that.coverdiscount(meetConditionPrices[meetConditionPrices.length-1].unitPrice, index, currentQuantity);
                }
            }
           
            meetConditionPrices = [];

           
        }
        if (this.props.dealitemTypes != undefined) {
            // console.log(this.props.dealitemTypes);
            dealitemTypes = this.props.dealitemTypes;
            for(let i = 0; i<dealitemTypes.length; i++){
                //判断最高购买要求
                if(dealitemTypes[i].maxQuantity != -1){
                    maxQuantity[i] = dealitemTypes[i].maxQuantity;
                }
                //判断最低购买要求
                if(dealitemTypes[i].minQuantity > 0){
                    quantity[i] = dealitemTypes[i].minQuantity;
                }else{
                    quantity[i] = 0;
                }
                //查找default=true的price
                let dealItemPrice = dealitemTypes[i].prices.find(function(ele){
                    return ele.default == true;
                });
                unitPrice[i] = dealItemPrice.unitPrice;
                originalPrice[i] = dealItemPrice.originalPrice

                //查找default=false的price
                let dealItemPriceFalse = dealitemTypes[i].prices.filter(function(ele){
                    return ele.default != true;
                });              
                dealItemPriceFalseArray[i] = dealItemPriceFalse;
            }
            
                that.startQuantity(quantity);
           
            // console.log(dealItemPriceFalseArray);
        }

        return (
            <div className={classes.root}>
                <div className='sectionHeader'>SELECT QUANTITY</div>
                {dealitemTypes.map(function (ele, index) {
                    return (
                        <Grid container spacing={24} key={index}>
                            <Grid item xs={7}>
                                <div className={classes.paper}>
                                    <div style={{ textAlign: 'left' }}>{ele.title}</div>
                                    <div style={{ textAlign: 'left', marginTop: 5 }}>
                                        <span className='quantityInitialPrice'>HKD {unitPrice[index] > that.state.discountprice[index] ? that.state.discountprice[index] : unitPrice[index]}</span>
                                        <span className='midDelete'>HKD {originalPrice[index]}</span>
                                    </div>
                                    <div style={{ textAlign: 'left' }}>Buy 1 more to save HKD 58.00</div>
                                </div>
                            </Grid>
                            <Grid item xs={5}>
                                <div id='quantityRight' className={classes.paper}>
                                    <span className='quantityNo'>{that.state.Quantity[index]}</span>
                                    <div className='quantityjiajian'>
                                        <span className='addStyle' onClick={(e) => addQuantity(that.state.Quantity[index],unitPrice[index],index,e)}>+</span>
                                        <span className='sumbmitStyle'>-</span>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    );
                })}

            </div>
        );
    }
}

Quantity.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Quantity);