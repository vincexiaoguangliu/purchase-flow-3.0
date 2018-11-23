import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

import '../App.css';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});

class QuestionList extends React.Component {
    state = {
        age: '',
        name: 'hai',
        // labelWidth: 0,
    };

    // componentDidMount() {
    //     this.setState({
    //         labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    //     });
    // }

    componentDidMount() {
        this.forceUpdate();
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    render() {
        const { classes } = this.props;
        var questionlWidth = {
            width: '100%',
        }
        return (
            <div className={classes.root}>
                <FormControl className={classes.formControl} style={questionlWidth}>
                    <InputLabel style={questionlWidth} shrink htmlFor="age-native-label-placeholder">
                        Please Select a drink
                    </InputLabel>
                    {/* <div className='sectionHeader'>Please Select a drink</div> */}
                    <NativeSelect
                        value={this.state.age}
                        onChange={this.handleChange('age')}
                        input={<Input name="age" id="age-native-label-placeholder" />}
                    >
                        <option value="">Coffee</option>
                        <option value={10}>Tea</option>
                        <option value={20}>Orange Juice</option>
                        <option value={30}>Bubble Tea</option>
                        <option value={40}>Coke</option>
                    </NativeSelect>
                    {/* <FormHelperText>Label + placeholder</FormHelperText> */}
                </FormControl>
                <div className={classes.container} style={questionlWidth}>
                    <FormControl className={classes.formControl} style={questionlWidth}>
                        <InputLabel htmlFor="component-simple">Are you hungry</InputLabel>
                        <Input id="component-simple" placeholder="Please list out your favorite snacks here!" />
                    </FormControl>
                </div>
            </div>

        )
    }
}

QuestionList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QuestionList);