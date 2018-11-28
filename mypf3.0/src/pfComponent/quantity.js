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
                       discountprice: [], //新的折扣价
                       dealitemTypes: this.props.dealitemTypes,
                       quantity: [], //当前数量
                       unitPrice: [], //折扣价
                       originalPrice: [], //原价
                       dealItemPriceFalseArray: [], //default 为false的price 2维数组
                       meetConditionPrices: [],
                       transferTimaslotId: this.props.timeslotId,
                       dealItemPrice: [], //初始default:true的price 不要写成对象形式
                       maxQuantity: [], //数量最大值
                       minQuantity: [], //数量最小值
                       isdiscountReminderDisplay: [],
                       numbermore: [],
                       morediscountprice: [],
                       afterAddDiscount: [] //discountereminder函数需要下下步的折扣价   这里用来存储
                    };
        this.addQuantity = this.addQuantity.bind(this);
        this.minusQuantity = this.minusQuantity.bind(this);
        
    }
   
    componentWillMount(){
        for(let i = 0; i<this.state.dealitemTypes.length; i++){
            //判断购买上限
            if(this.state.dealitemTypes[i].maxQuantity != -1){
                this.state.maxQuantity[i] = this.state.dealitemTypes[i].maxQuantity;
            }else{
                this.state.maxQuantity[i] = 9999;
            }
            //判断最低购买要求
            if(this.state.dealitemTypes[i].minQuantity > 0){
                this.state.quantity[i] = this.state.dealitemTypes[i].minQuantity;
                this.state.minQuantity[i] = this.state.dealitemTypes[i].minQuantity;
            }else{
                this.state.quantity[i] = 0;
                this.state.minQuantity[i] = 0;
            }

            //查找default=true的price
            let dealItemPrice = this.state.dealitemTypes[i].prices.find(function(ele){
                return ele.default == true;
            });
            // this.setState({dealItemPrice: dealItemPrice});
            this.state.dealItemPrice.push(dealItemPrice.unitPrice);
            this.state.unitPrice[i] = dealItemPrice.unitPrice;
            this.state.originalPrice[i] = dealItemPrice.originalPrice;

            //查找default=false的price
            let dealItemPriceFalse = this.state.dealitemTypes[i].prices.filter(function(ele){
                return ele.default != true;
            });              
            this.state.dealItemPriceFalseArray[i] = dealItemPriceFalse;

            //buy more reminder的初始状态 与初始化过滤计算
            this.state.isdiscountReminderDisplay[i] = false;
            this.displayDiscountedpriceReminder(this.state.quantity[i]+1, i, this.state.unitPrice[i]);
            
        }
    }
    //加1过程判断是否显示discountedpriceReminder
    displayDiscountedpriceReminder(currentQuantity, index, currentdiscountPrice){
        console.log(currentdiscountPrice);
        //每次需要清空操作
        this.state.meetConditionPrices = [];
        for(let j=0; j<this.state.dealItemPriceFalseArray[index].length; j++){
            if(this.state.dealItemPriceFalseArray[index][j].conditions.quantity && this.state.dealItemPriceFalseArray[index][j].conditions.timeslot){
                if(((currentQuantity>=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.minimum) && (currentQuantity<=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.maximum)) && (this.state.transferTimaslotId == this.state.dealItemPriceFalseArray[index][j].conditions.timeslot.id)){
                    this.state.meetConditionPrices.push(this.state.dealItemPriceFalseArray[index][j]);
                }
            }else if(this.state.dealItemPriceFalseArray[index][j].conditions.quantity){
                if((currentQuantity>=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.minimum) && (currentQuantity<=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.maximum)){
                    this.state.meetConditionPrices.push(this.state.dealItemPriceFalseArray[index][j]);
                }
            }
        }
        this.state.meetConditionPrices.sort(function(a,b){
            return a.priority - b.priority;
        })
        if(this.state.meetConditionPrices.length>0){
            if(this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].unitPrice < currentdiscountPrice){ 
                    this.state.numbermore[index] =  this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].conditions.quantity.minimum;                                         
                    let newdiscountprice = this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].unitPrice; 
                    this.state.morediscountprice[index] = this.state.numbermore[index]*(currentdiscountPrice - newdiscountprice); 
                    this.state.isdiscountReminderDisplay[index] = true;                             
            }else{
                this.state.isdiscountReminderDisplay[index] = false;
            }
        }else{
            this.state.isdiscountReminderDisplay[index] = false;
        }
    }

    //减1过程判断是否显示discountedpriceReminder

    //数量加1操作中获取满足condition要求的price  并按priority排序 覆盖旧的unitprice 的封装
    getMeetConditionPricesByAdd(currentQuantity, index, currentdiscountPrice){
        this.state.meetConditionPrices = [];
        for(let j=0; j<this.state.dealItemPriceFalseArray[index].length; j++){
            if(this.state.dealItemPriceFalseArray[index][j].conditions.quantity && this.state.dealItemPriceFalseArray[index][j].conditions.timeslot){
                if(((currentQuantity+1>=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.minimum) && (currentQuantity+1<=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.maximum)) && (this.state.transferTimaslotId == this.state.dealItemPriceFalseArray[index][j].conditions.timeslot.id)){
                    this.state.meetConditionPrices.push(this.state.dealItemPriceFalseArray[index][j]);
                }
            }else if(this.state.dealItemPriceFalseArray[index][j].conditions.quantity){
                if((currentQuantity+1>=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.minimum) && (currentQuantity+1<=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.maximum)){
                    this.state.meetConditionPrices.push(this.state.dealItemPriceFalseArray[index][j]);
                }
            }else if(this.state.dealItemPriceFalseArray[index][j].conditions.timeslot){
                if(this.state.transferTimaslotId == this.state.dealItemPriceFalseArray[index][j].conditions.timeslot.id){
                    this.state.meetConditionPrices.push(this.state.dealItemPriceFalseArray[index][j]);
                }
            }
        }
        this.state.meetConditionPrices.sort(function(a,b){
            return a.priority - b.priority;
        })
        if(this.state.meetConditionPrices.length>0){
            if(this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].unitPrice < currentdiscountPrice){
                console.log(this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].unitPrice);                             
                    let newdiscountprice = this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].unitPrice;
                    this.state.afterAddDiscount[index] = newdiscountprice; //这里赋值传给discountreminder函数
                    let temp1 = {...this.state.discountprice, [index]:newdiscountprice};
                    //新的折扣季覆盖旧的uniteprice             
                    this.setState({discountprice: temp1});              
            }
        }
    }

    //数量减1操作中获取满足condition要求的price  并按priority排序 覆盖旧的unitprice 的封装
    getMeetConditionPricesByMinus(currentQuantity, index, currentdiscountPrice){
        this.state.meetConditionPrices = [];
        if(currentQuantity-1 > this.state.minQuantity[index]){
            for(let j=0; j<this.state.dealItemPriceFalseArray[index].length; j++){
                if(this.state.dealItemPriceFalseArray[index][j].conditions.quantity && this.state.dealItemPriceFalseArray[index][j].conditions.timeslot){
                    if(((currentQuantity-1>=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.minimum) && (currentQuantity-1<=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.maximum)) && (this.state.transferTimaslotId == this.state.dealItemPriceFalseArray[index][j].conditions.timeslot.id)){
                        this.state.meetConditionPrices.push(this.state.dealItemPriceFalseArray[index][j]);
                    }
                }else if(this.state.dealItemPriceFalseArray[index][j].conditions.quantity){
                    if((currentQuantity-1>=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.minimum) && (currentQuantity-1<=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.maximum)){
                        this.state.meetConditionPrices.push(this.state.dealItemPriceFalseArray[index][j]);
                    }
                }else if(this.state.dealItemPriceFalseArray[index][j].conditions.timeslot){
                    if(this.state.transferTimaslotId == this.state.dealItemPriceFalseArray[index][j].conditions.timeslot.id){
                        this.state.meetConditionPrices.push(this.state.dealItemPriceFalseArray[index][j]);
                    }
                }
            }
            this.state.meetConditionPrices.sort(function(a,b){
                return a.priority - b.priority;
            })
            if(this.state.meetConditionPrices.length>0){
                if(this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].unitPrice < currentdiscountPrice){
                    console.log(this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].unitPrice);
                    this.state.afterAddDiscount[index] = newdiscountprice;                             
                        let newdiscountprice = this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].unitPrice;
                        let temp1 = {...this.state.discountprice, [index]:newdiscountprice};
                        //新的折扣季覆盖旧的uniteprice             
                        this.setState({discountprice: temp1});              
                }
            }else{
                //无过滤的conditions放default 为true的折扣价
                // let newdiscountprice = this.state.dealItemPrice.unitPrice;
                // let temp2 = {...this.state.discountprice, [index]:newdiscountprice};
                // this.setState({discountprice: temp2});  
            }
        }else{
            //减一操作到最小时还原成最小quantity时的折扣价。
            let newdiscountprice = this.state.dealItemPrice[index];
            this.state.afterAddDiscount[index] = newdiscountprice;
            let temp3 = {...this.state.discountprice, [index]:newdiscountprice};
            this.setState({discountprice: temp3});
        }
        
    }
    addQuantity(currentQuantity,index,e){
        // console.log(e.currentTarget.getAttribute('currentdiscountprice')); //这里要用e获取当前的折扣价。
        this.getMeetConditionPricesByAdd(currentQuantity,index,e.currentTarget.getAttribute('currentdiscountprice'));
        console.log(this.state.meetConditionPrices);
        console.log(this.state.unitPrice[index]);
        this.displayDiscountedpriceReminder(currentQuantity+2,index,this.state.afterAddDiscount[index]);
        //数量加一操作
        if(currentQuantity < this.state.maxQuantity[index]){
            let temp2 = {...this.state.quantity, [index]:currentQuantity+1};
            this.setState({quantity: temp2});
        }else{
            return false;
        }
              
       
        
    }
    minusQuantity(currentQuantity,index,e) {
        this.getMeetConditionPricesByMinus(currentQuantity,index,e.currentTarget.getAttribute('currentdiscountprice'));
        console.log(this.state.meetConditionPrices);
        console.log(this.state.unitPrice[index]);
        this.displayDiscountedpriceReminder(currentQuantity,index,this.state.afterAddDiscount[index]);      
        //数量减一操作
        if(currentQuantity > this.state.minQuantity[index]){
            let temp3 = {...this.state.quantity, [index]:currentQuantity-1};
            this.setState({quantity: temp3});
        }else{
            return false;
        }
            
        this.state.meetConditionPrices = [];
        
    }
    
    //覆盖旧的折扣价 unitprice
   
    render() {  
        const { classes } = this.props;        
        let that = this;
     
        return (
            <div className={classes.root}>
                <div className='sectionHeader'>SELECT QUANTITY</div>
                {this.state.dealitemTypes.map(function (ele, index) {
                    return (
                        <Grid container spacing={24} key={index}>
                            <Grid item xs={7}>
                                <div className={classes.paper}>
                                    <div style={{ textAlign: 'left' }}>{ele.title}</div>
                                    <div style={{ textAlign: 'left', marginTop: 5 }}>
                                        <span className='quantityInitialPrice'>HKD {that.state.unitPrice[index]> that.state.discountprice[index] ? that.state.discountprice[index] : that.state.unitPrice[index]}</span>
                                        <span className='midDelete'>HKD {that.state.originalPrice[index]}</span>
                                    </div>
                                    {that.state.isdiscountReminderDisplay[index] && <div style={{ textAlign: 'left' }}>Buy {that.state.numbermore[index]} more to save HKD {that.state.morediscountprice[index]}</div>}
                                    
                                </div>
                            </Grid>
                            <Grid item xs={5}>
                                <div id='quantityRight' className={classes.paper}>
                                    <span className='quantityNo'>{that.state.quantity[index]}</span>
                                    <div className='quantityjiajian'>
                                    <span className='sumbmitStyle' currentdiscountprice={that.state.unitPrice[index]> that.state.discountprice[index] ? that.state.discountprice[index] : that.state.unitPrice[index]} onClick={that.minusQuantity.bind(this,that.state.quantity[index],index)}>-</span>
                                    <span className='addStyle' currentdiscountprice={that.state.unitPrice[index]> that.state.discountprice[index] ? that.state.discountprice[index] : that.state.unitPrice[index]} onClick={that.addQuantity.bind(this,that.state.quantity[index],index)}>+</span>                
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