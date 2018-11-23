import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
// import IconButton from '@material-ui/core/IconButton';
// import CommentIcon from '@material-ui/icons/Comment';

const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  });

  class ConfirmationTotal extends React.Component {
    state = {
      checked: [0],
    };
  
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
  
    render() {
      const { classes } = this.props;
  
      return (
        <div className={classes.root} id='confirmationTotalHeadertop'>
            <div className='confirmationTotalHeader'>
                <span>Total</span><span className='confirmationTotalHeaderRight'>HKD 299</span>
            </div>
          <List>
            {[0].map(value => (
              <ListItem key={value} role={undefined} dense button onClick={this.handleToggle(value)}>
                <Checkbox
                  checked={this.state.checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  style={{color:'#ff4800'}}
                />
                <ListItemText primary={`handy may use my email to send communications.(You may opy out at anytime)`} />
               
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
               
              </ListItem>
            ))}
          </List>
        </div>
      );
    }
  }
  
  ConfirmationTotal.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(ConfirmationTotal);