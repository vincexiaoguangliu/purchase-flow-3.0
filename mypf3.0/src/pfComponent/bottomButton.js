import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import request from '../api/request';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});

class BottomButton extends React.Component{
    constructor(props){
        super(props);
        this.state={
            bottonButtonText: 'NEXT',
            sum: 0, //总数量>0  button就高亮
            userInf: {},
            email: '',
            open: false,
            vertical: 'top',
            horizontal: 'center',
            confirmInfo: ''
        }
        this.handleBottomButton = this.handleBottomButton.bind(this);
        this.confirmBodyPar = {}
    }
    
    componentWillReceiveProps(nextProps){
        console.log(nextProps, 2333333);
        this.setState({userInf: nextProps.verifyUserInf});
        console.log(this.state.userInf.buttonText);
        //接收父组件buttonText重新点击apply remove 来显示下面模块
        if(this.state.userInf.buttonText == 'buttonTextone'){
            this.setState({bottonButtonText : 'CONFIRM',sum: 1});
            this.state.sum = 0;
        };
        if(this.state.userInf.buttonText == 'buttonTexttwo'){      //接收父组件的buttonText重新点击quantity 来显示下面模块
            this.setState({bottonButtonText : 'NEXT',sum: 1});
            this.state.userInf.buttonText = ''; //清空， 防止其他点击时 又执行这一步；  巨坑
            this.state.sum = 0;
        }

        if(this.state.userInf.buttonText == 'buttonTextthree'){      //接收父组件的buttonText重新点击quantity 来显示下面模块
            this.setState({bottonButtonText : 'NEXT',sum: 0});
            this.state.userInf.buttonText = ''; //清空， 防止其他点击时 又执行这一步；  巨坑
        }
        
        //判断是否打钩协议
        if(this.state.userInf.checkedInfo){
            if(this.state.userInf.checkedInfo.terms){
                this.setState({bottonButtonText : 'PAY NOW'})
                
                this.confirmBodyPar.optIn = this.props.verifyUserInf.optIn.isRender
                this.iLink = `dealpaymentoption:${JSON.stringify(this.confirmBodyPar)}`
                this.state.userInf.checkedInfo = undefined; //防止将上面的点击apply remove时的buttontext覆盖；
            }else{
                this.setState({bottonButtonText : 'CONFIRM',sum: 0}); 
                // this.state.userInf.checkedInfo.terms = false;
                this.state.userInf.checkedInfo = undefined; //防止将上面的点击apply remove时的buttontext覆盖；
            }
            
        }
        if(nextProps.quantityContral != undefined){
            let total = 0;;
            for(let i = 0; i<nextProps.quantityContral.length; i++){
                total += nextProps.quantityContral[i];
            }
            this.setState({sum: total});
        }     
    }

    handleClick(){
        this.setState({ open: true});
      };
    
    handleClose = () => {
        this.setState({ open: false });
      };
    async handleBottomButton(e){ 
        if(e.currentTarget.getAttribute('buttontext') == 'NEXT'){
            this.props.onHandleNext(true);
            this.setState({bottonButtonText: 'CONFIRM'})
        }else if(e.currentTarget.getAttribute('buttontext') == 'CONFIRM'){
            let questionFlag = true;
            let emailFlag;
            let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{1,4})$/;
            //判断question是否填信息
            if(this.state.userInf.answers){
                Object.keys(this.state.userInf.answers).forEach((key) => {
                    if(this.state.userInf.answers[key].value.length == 0){
                        questionFlag = false;
                    }
                })
            }
            //判断邮箱格式是否正确
            if(this.state.userInf.userInfo != undefined){
                if(this.state.userInf.userInfo.email != undefined){
                    if(reg.test(this.state.userInf.userInfo.email)){
                                emailFlag = true;
                    }
                }
            }
            // 验证通过发给后台校验
            const quantities = {}
            this.props.verifyUserInf.priceInfo.forEach(item => {
                quantities[item.id] = item.count
            })
            this.confirmBodyPar = {
                "answers": this.props.verifyUserInf.packageInfo.answers,
                "date": "Jul 4, 2018 00:00:00",
                "dealId": this.props.verifyUserInf.dealId,
                "packageId": this.props.verifyUserInf.packageInfo.id,
                "promotionId": this.props.verifyUserInf.promotionItem ? this.props.verifyUserInf.promotionItem.id : '',
                "quantities": quantities,
                "timeslotId": this.props.verifyUserInf.timeslotId,
                "userInfo": {
                    "firstName": this.props.verifyUserInf.userInfo.firstName,
                    "lastName": this.props.verifyUserInf.userInfo.lastName,
                    "email": this.props.verifyUserInf.userInfo.email,
                }
            }
            try {
                //所有验证通过向后台发送数据
                if(questionFlag && emailFlag && this.state.userInf.userInfo.firstName && this.state.userInf.userInfo.lastName){
                    let result = await request.confirmDealInfo(this.confirmBodyPar)
                    console.log(result, 23333334567)
                    if (result.success) {
                        this.props.onHandleFirstConfirm('',true);
                        this.setState({sum: 0});
                    } else {
                        this.setState({
                            confirmInfo: result.message
                        })
                    }
                } else {
                    this.handleClick();
                    this.props.onHandleFirstConfirm('',false);
                    this.setState({sum: 1});
                }
            } catch (e) {
                console.log(e)
            }
        }
        
    }
    render(){
        console.log(this.state);
        const { classes } = this.props;
        const { vertical, horizontal, open } = this.state;
        return (
            <div style={{paddingRight:20,paddingLeft:20}}>
                <Button id='bottomButton' variant="contained" buttontext={this.state.bottonButtonText} color="secondary" onClick={this.handleBottomButton} disabled={this.state.sum>0? false: true}  className={classes.button}>
                    {this.state.bottonButtonText}
                </Button>
                <p>{this.state.confirmInfo}</p>
                <a href={this.iLink}>{ this.iLink ? 'iLink' : ''}</a>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={open}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Please fill in the whole user information which include your firstName、lastName、Email or the questios!</span>}
                    />
            </div>
        )
    }    
  
}

BottomButton.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(BottomButton);
