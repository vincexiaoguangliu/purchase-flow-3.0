import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
 
});

function SelectTime(props) {
  const { classes } = props;
  return (
    
    <div>
      <div className='sectionHeader'>SELECT TIME</div>
      <Button variant="outlined" className={classes.button}>
        12:00
      </Button>
    </div>
  );
}

SelectTime.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SelectTime);