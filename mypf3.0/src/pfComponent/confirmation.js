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
    state = {
      selectedIndex: 1,
    };
  
    handleListItemClick = (event, index) => {
      this.setState({ selectedIndex: index });
    };
  
    render() {
      const { classes } = this.props;
  
      return (
          
        <div className={classes.root} style={{maxWidth:'100%'}}>
        <div className='sectionHeader'>YOUR BOOKING ORDER</div>
          <List component="nav">
            <div className='confirmName'>
                charles
            </div>
            <div className='confirmationMail'>
                111111111@qq.com
            </div>
            <div className='confirmationQuestion1'>
                Please Select a drink: Coffee
            </div>
            <div className='confirmationQuestion2'>
                Are you hungry?: yes
            </div>
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