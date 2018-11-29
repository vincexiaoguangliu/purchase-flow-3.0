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
    constructor(props) {
        super(props)
        this.state = {
            age: '',
            name: 'hai',
            dropDownQuestions: [],
            textQuestions: [],
        };
        // this.dropDownQuestions = [1,2]
    }
    
    componentDidMount() {
        this.formatQuestionList()
    };

    formatQuestionList () {
        // this.dropDownQuestions = this.props.questions.filter(item => item.type === 'dropdown')
        this.setState({
            dropDownQuestions: this.props.questions.filter(item => {
                // 只展示有 title 的 question
                if (item.title) {
                    return item.type === 'dropdown'
                }
            }),
            textQuestions: this.props.questions.filter(item => {
                if (item.title) {
                    return item.type === 'text'
                }
            }),
        })
    }

    handleChange = name => event => {
        // console.log(this.state.dropDownQuestions, 111, this.props.questions)
        this.setState({ [name]: event.target.value });
    };

    render() {
        const { classes } = this.props;
        var questionlWidth = {
            width: '100%',
        }
        return (
            <div className={classes.root}>
                {this.state.dropDownQuestions.map(question => (
                    <FormControl className={classes.formControl} style={questionlWidth}>
                        <InputLabel style={questionlWidth} shrink htmlFor="age-native-label-placeholder">
                            {question.title}
                        </InputLabel>
                        <NativeSelect
                            value={this.state.age}
                            onChange={this.handleChange('age')}
                            input={<Input name="age" id="age-native-label-placeholder" />}
                        >
                            {question.choices.map(item => (
                                <option value={item.value}>{item.title}</option>
                            ))}
                        </NativeSelect>
                    </FormControl>
                ))}
                {this.state.textQuestions.map(question => (
                    <div className={classes.container} style={questionlWidth}>
                        <FormControl className={classes.formControl} style={questionlWidth}>
                            <InputLabel htmlFor="component-simple">{question.title}</InputLabel>
                            <Input id="component-simple" placeholder={question.placeholder} />
                        </FormControl>
                    </div>
                ))}
            </div>
        )
    }
}

QuestionList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QuestionList);
