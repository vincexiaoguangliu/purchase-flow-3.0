import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';

import '../App.css';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    input: {
        margin: theme.spacing.unit,
    },
});

function Userdetails(props) {
    const { classes } = props;
    var detailWidth = {
        width:'100%',
    }
    return (
        <div className={classes.container}>
        <div className='sectionHeader' style={detailWidth}>YOUR DETAILS</div>
           <Input
                placeholder="Passport First Name"
                className={classes.input}
                inputProps={{
                    'aria-label': 'Description',
                }}
                style={detailWidth}
                id='userDetails'
            />   
             <Input
                placeholder="Passport Last Name"
                className={classes.input}
                inputProps={{
                    'aria-label': 'Description',
                }}
                style={detailWidth}
                id='userDetails'
            /> 
             <Input
                placeholder="Email Address to Receive Voucher"
                className={classes.input}
                inputProps={{
                    'aria-label': 'Description',
                }}
                style={detailWidth}
                id='userDetails'
            />        
        </div>
    );
}

Userdetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Userdetails);