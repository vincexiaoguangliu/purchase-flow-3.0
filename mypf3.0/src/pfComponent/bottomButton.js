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

function BottomButton(props) {
    const { classes } = props;
    return (
        <div style={{paddingRight:20,paddingLeft:20}}>
            <Button id='bottomButton' variant="contained" color="secondary" className={classes.button}>
                PAY NOW
            </Button>
        </div>
    )
}

BottomButton.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(BottomButton);