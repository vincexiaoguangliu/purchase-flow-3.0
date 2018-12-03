import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import ConfirmationTotal from './confirmationTotal'


const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  });

  class Confirmation extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        selectedIndex: 1,
        questionList: []
      }
    }
  
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
  
      return (
          
        <div className={classes.root} style={{maxWidth:'100%'}}>
        <div className='sectionHeader'>YOUR BOOKING ORDER</div>
          <List component="nav">
            <div className='confirmName'>
              {this.props.confirmInfo.userDetails.firstName} {this.props.confirmInfo.userDetails.lastName}
            </div>
            <div className='confirmationMail'>
              {this.props.confirmInfo.userDetails.email}
            </div>
            {
              this.state.questionList.map(question => (
                <div className='confirmationQuestion1'>
                  {question.title}: {question.description}
                </div>
              ))
            }
          </List>
          <Divider />
          <List component="nav">
            <div className='confirmationPackage'>Package</div>
            <div className='confirmationPackageList'>
                <span>1×adult</span><span className='confirmationPackageListRight'>HKD 299</span>
            </div>
          </List>
          <Divider />
          <ConfirmationTotal />
        </div>
      );
    }
  }
  
  Confirmation.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(Confirmation);  
