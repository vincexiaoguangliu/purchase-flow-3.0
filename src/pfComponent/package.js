import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';

import '../App.css';

const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
  });

  class SelectPackage extends React.Component {
    state = {
        selectedValue: '0',
      };
    
      handleChange = event => {
        this.setState({ selectedValue: event.target.value });
      };
      render(){
        const { classes } = this.props;
        return (
            <div>
              <div className='sectionHeader'>SELECT PACKAGES</div>
              <div className={classes.root} style={{maxWidth:'100%'}}>
              <List> 
                {[0,1].map(value => (
                  <ListItem key={value} dense button>
                    <div>
                      <div>Cable Car Sky Pass(1 Round Trip)</div>
                      <div style={{marginTop:6}}><span>SGD22</span><span className='priceDelete'>SGD35</span></div>
                    </div>
                    <ListItemSecondaryAction>
                      <Checkbox
                        onChange={this.handleChange}
                        checked={this.state.selectedValue === `${value}`}
                        value={value}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        )
      }
  }

  SelectPackage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(SelectPackage);