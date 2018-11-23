import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    formControl: {
        margin: theme.spacing.unit * 3,
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
    },
});

class PaymentMethod extends React.Component {
    state = {
        value: 'Bill To Room',
    };

    handleChange = event => {
        this.setState({ value: event.target.value });
    };

    render() {
        const { classes } = this.props;
       
        return (
            <div className={classes.root}>             
                <FormControl id='paymentContral'  component="fieldset" className={classes.formControl}>              
                    <FormLabel id='paymentLabel' component="legend">PAYMENT METHOD</FormLabel>
                    <RadioGroup
                        aria-label="gender"
                        name="gender2"
                        className={classes.group}
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{marginRight:'4%'}}
                    >
                        <FormControlLabel
                            value="Bill To Room"
                            control={<Radio color="primary"/>}
                            label={<div className='paymentLabel'><span className='paymentBill'></span>Bill To Room</div>}
                            labelPlacement="start"
                            style={{position:'relative'}}
                        />
                        <FormControlLabel
                            value="Credit Card"
                            control={<Radio color="primary" />}
                            label={<div className='paymentLabel'><span className='paymentCredit'></span>Credit Card</div>}
                            labelPlacement="start"
                            style={{position:'relative'}}
                        />
                        <FormControlLabel
                            value="WeChat Pay"
                            control={<Radio color="primary" />}
                            label={<div className='paymentLabel'><span className='paymentWechat'></span>Wechat Pay</div>}
                            labelPlacement="start"
                            style={{position:'relative'}}
                        />
                        <FormControlLabel
                            value="Union Pay"
                            control={<Radio color="primary"/>}
                            label={<div className='paymentLabel'><span className='paymentUnion'></span>Union Pay</div>}
                            labelPlacement="start"
                            style={{position:'relative'}}
                        />
                    </RadioGroup>

                </FormControl>
            </div>
        );
    }
}

PaymentMethod.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PaymentMethod);