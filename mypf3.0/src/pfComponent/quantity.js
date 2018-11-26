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
        console.log(this.props.dealitemTypes);
        this.state = { number: 0 ,
                       discountprice: [],
                       dealitemTypes: this.props.dealitemTypes,
                       quantity: [], //当前数量
                       unitPrice: [], //折扣价
                       originalPrice: [], //原价
                       dealItemPriceFalseArray: [], //default 为false的price 2维数组
                       meetConditionPrices: [],
                       transferTimaslotId: this.props.timeslotId,
                       dealItemPrice: {} //初始default:true的price
                    };
        this.addQuantity = this.addQuantity.bind(this);
        this.submiteQuantity = this.submiteQuantity.bind(this);
        
    }
   
    componentWillMount(){
        for(let i = 0; i<this.state.dealitemTypes.length; i++){
            //判断最低购买要求
            if(this.state.dealitemTypes[i].minQuantity > 0){
                this.state.quantity[i] = this.state.dealitemTypes[i].minQuantity;
            }else{
                this.state.quantity[i] = 0;
            }

            //查找default=true的price
            let dealItemPrice = this.state.dealitemTypes[i].prices.find(function(ele){
                return ele.default == true;
            });
            this.setState({dealItemPrice: dealItemPrice});
            this.state.unitPrice[i] = dealItemPrice.unitPrice;
            this.state.originalPrice[i] = dealItemPrice.originalPrice;

            //查找default=false的price
            let dealItemPriceFalse = this.state.dealitemTypes[i].prices.filter(function(ele){
                return ele.default != true;
            });              
            this.state.dealItemPriceFalseArray[i] = dealItemPriceFalse;
        }
    }
    addQuantity(currentQuantity,currentdiscountPrice,index,e){
        for(let j=0; j<this.state.dealItemPriceFalseArray[index].length; j++){
            if(this.state.dealItemPriceFalseArray[index][j].conditions.quantity && this.state.dealItemPriceFalseArray[index][j].conditions.timeslot){
                if(((currentQuantity>=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.minimum) && (currentQuantity<=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.maximum)) && (this.state.transferTimaslotId == this.state.dealItemPriceFalseArray[index][j].conditions.timeslot.id)){
                    this.state.meetConditionPrices.push(this.state.dealItemPriceFalseArray[index][j]);
                }
            }else if(this.state.dealItemPriceFalseArray[index][j].conditions.quantity){
                if((currentQuantity>=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.minimum) && (currentQuantity<=this.state.dealItemPriceFalseArray[index][j].conditions.quantity.maximum)){
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
        console.log(this.state.meetConditionPrices);
        console.log(this.state.unitPrice[index]);
        if(this.state.meetConditionPrices.length>0){
            if(this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].unitPrice < this.state.unitPrice[index]){
                console.log(this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].unitPrice);                             
                    let newdiscountprice = this.state.meetConditionPrices[this.state.meetConditionPrices.length-1].unitPrice;
                    let temp1 = {...this.state.discountprice, [index]:newdiscountprice};             
                    this.setState({discountprice: temp1});              
            }
        }
       
        let temp2 = {...this.state.quantity, [index]:currentQuantity+1};
        this.setState({quantity: temp2});
        this.state.meetConditionPrices = [];
        
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
                                    <div style={{ textAlign: 'left' }}>Buy 1 more to save HKD 58.00</div>
                                </div>
                            </Grid>
                            <Grid item xs={5}>
                                <div id='quantityRight' className={classes.paper}>
                                    <span className='quantityNo'>{that.state.quantity[index]}</span>
                                    <div className='quantityjiajian'>
                                        <span className='addStyle' onClick={that.addQuantity.bind(this,that.state.quantity[index],that.state.unitPrice[index],index)}>+</span>
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