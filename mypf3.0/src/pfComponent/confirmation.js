import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';

// import ConfirmationTotal from './confirmationTotal'


const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    promotionInfo: {
      color: '#ff8400',
      paddingTop: 10,
      fontSize: 16,
    },
    promotionInfoRight: {
      color: '#ff8400',
      float: 'right',
      paddingRight: '4%',
      whiteSpace: 'nowrap',
      fontSize: 16,
    }
  });

  class Confirmation extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        selectedIndex: 1,
        questionList: [],
        checked: [],
      }
    }
  
    handleToggle = value => () => {
      const { checked } = this.state;
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      this.setState({
        checked: newChecked,
      });
    };
  
    handleListItemClick = (event, index) => {
      this.setState({ selectedIndex: index });
    };

    componentDidMount() {
      if (this.props.confirmInfo.answers) {
        let tmpQuestionList = []
        Object.keys(this.props.confirmInfo.answers).forEach(key => {
          tmpQuestionList.push(this.props.confirmInfo.answers[key])
        })
        this.setState({
          questionList: tmpQuestionList
        })
      }
    }
  
    render() {
      const { classes } = this.props;
      const currency = this.props.confirmInfo.priceInfo.currency
      let totalPrice = 0
      this.props.confirmInfo.priceInfo.dealItems.forEach(item => {
        totalPrice += item.count * item.price
      })
      const discountPrice = (totalPrice * this.props.confirmInfo.promotionItem.ratio / 100).toFixed(2)
      const actualPayment = (totalPrice - discountPrice).toFixed(2)
  
      return (
        <div className={classes.root} style={{maxWidth:'100%'}}>
        <div className='sectionHeader'>YOUR BOOKING ORDER</div>
          <List component="nav">
            <div className='confirmationPackage'>Package</div>
            <div className='confirmationPackageList'>
              {this.props.confirmInfo.priceInfo.dealItems.map(item => (
                <div key={item.title}>
                  <span>{item.count} × {item.title}</span><span className='confirmationPackageListRight'>{currency} {item.count * item.price}</span>
                </div>
              ))}
            </div>
            <div className='confirmationPackageList'>
              <span className={classes.promotionInfo}>
                Regression QA-{this.props.confirmInfo.promotionItem.ratio}%</span>
              <span className={classes.promotionInfoRight}>-{currency} {discountPrice}</span>
            </div>
          </List>
          <Divider />
          <List component="nav">
            <div className='confirmationTotalHeader'>
              <span>TOTAL</span><span className='confirmationTotalHeaderRight'>HKD {actualPayment}</span>
            </div>
            {this.props.confirmInfo.optIn.isRender && [0].map(value => (
              <ListItem key={value} role={undefined} dense button onClick={this.handleToggle(value)}>
                <Checkbox
                  checked={this.state.checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  style={{color:'#ff4800'}}
                />
                <ListItemText primary={`handy may use54 my email to send communications.(You may opy out at anytime)`} />
               
              </ListItem>
            ))}
            {[1].map(value => (
              <ListItem key={value} role={undefined} dense button onClick={this.handleToggle(value)}>
                <Checkbox
                  checked={this.state.checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  style={{color:'#ff4800'}}
                />
                <ListItemText primary={`I agree to Terms and Conditions`} />
                {/* <span onClick={this.testClick}>test</span> */}
              </ListItem>
            ))}
          </List>
          {/* <Divider /> */}
          {/* <ConfirmationTotal /> */}
        </div>
      );
    }
  }
  
  Confirmation.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(Confirmation);  
