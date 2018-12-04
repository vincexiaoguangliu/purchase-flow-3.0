import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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
            bottonButtonText: 'Next',
            sum: 0 //总数量>0  button就高亮
        }
        this.handleBottomButton = this.handleBottomButton.bind(this);
    }
    
    componentWillReceiveProps(nextProps){
        console.log(nextProps);
        if(nextProps.quantityContral != undefined){
            for(let i = 0; i<nextProps.quantityContral.length; i++){
                this.state.sum += nextProps.quantityContral[i];
            }
        }     
    }
    handleBottomButton(e){ 
        if(e.currentTarget.getAttribute('buttonText') == 'Next'){
            this.props.onHandleNext(true);
            this.setState({bottonButtonText: 'CONFIRM'})
        }else if(e.currentTarget.getAttribute('buttonText') == 'CONFIRM'){
            this.props.onHandleFirstConfirm(true);
            this.setState({sum: 0});
        }
        
    }
    render(){
        const { classes } = this.props;
     
        return (
            <div style={{paddingRight:20,paddingLeft:20}}>
                <Button id='bottomButton' variant="contained" buttonText={this.state.bottonButtonText} color="secondary" onClick={this.handleBottomButton} disabled={this.state.sum>0? false: true}  className={classes.button}>
                    {this.state.bottonButtonText}
                </Button>
            </div>
        )
    }    
  
}

BottomButton.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(BottomButton);