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
            dropDownQuestions: [],
            textQuestions: [],
            dropDownQuestionValue: [],
            textQuestionValue: [],
        };
        this.answers = {}
    }

    // 筛选需要展示的 question
    getDisplayQuestionList (type) {
        return this.props.questions.filter(item => {
            // 只展示有 title 的 question
            if (item.title) {
                // 根据条件判断展示的 question
                if (item.conditions === null) {
                    return item.type === type
                } else if (item.conditions.timeslot.id && item.conditions.packageId === undefined) {
                    return item.type === type && this.props.timeslotId === item.conditions.timeslot.id
                } else if (item.conditions.timeslot.id === undefined && item.conditions.packageId) {
                    return item.type === type && this.props.packageId === item.conditions.packageId
                } else {
                    return item.type === type
                        && this.props.packageId === item.conditions.packageId
                        && this.props.timeslotId === item.conditions.timeslot.id
                }
            }
        })
    }

    init () {
        const dropDownQuestions = this.getDisplayQuestionList('dropdown')
        const textQuestions = this.getDisplayQuestionList('text')
        this.setState({
            dropDownQuestions: dropDownQuestions,
            textQuestions: textQuestions,
        });
        
        // 初始化
        dropDownQuestions.forEach((item) => {
            // 初始化答案
            this.answers[item.name] = {
                description: item.choices[0].title,
                name: item.name,
                title: item.title,
                value: item.choices[0].value
            }
        })
        let tmpTextQuestions = []
        textQuestions.forEach((item) => {
            // 初始化答案
            this.answers[item.name] = {
                description: '',
                name: item.name,
                title: item.title,
                value: ''
            }
            // 初始化 textQuestions input
            tmpTextQuestions.push('')
        })
        this.setState({
            textQuestionValue: tmpTextQuestions,
        })

        this.sendAnswersToParent(this.answers)
    }

    handleChange = (question, index, type) => event => {
        if (type === 'dropdown') {
            const dropDownQuestionValue = this.state.dropDownQuestionValue;
            dropDownQuestionValue[index] = event.target.value;
            this.setState({ dropDownQuestionValue: dropDownQuestionValue });

            // 获取选中 option 的 label
            let obj = {};
            obj = question.choices.find(item => item.value === event.target.value);

            this.answers[question.name].description = obj.title;
            this.answers[question.name].value = event.target.value;
        } else {
            const textQuestionValue = this.state.textQuestionValue;
            textQuestionValue[index] = event.target.value;
            this.setState({ textQuestionValue: textQuestionValue });
            this.answers[question.name].description = event.target.value;
            this.answers[question.name].value = event.target.value;
        }
        this.sendAnswersToParent(this.answers)
    }

    sendAnswersToParent(answers) {
        this.props.getQuestionListAnswers('answers', answers)
    }

    componentDidMount() {
        this.init()
    }

    render() {
        const { classes } = this.props;
        var questionlWidth = {
            width: '100%',
        }
        return (
            <div className={classes.root}>
                {this.state.dropDownQuestions.map((question, index) => (
                    <FormControl className={classes.formControl} style={questionlWidth}>
                        <InputLabel style={questionlWidth} shrink htmlFor="age-native-label-placeholder">
                            {question.title}
                        </InputLabel>
                        <NativeSelect
                            value={this.state.dropDownQuestionValue[index]}
                            onChange={this.handleChange(question, index, 'dropdown')}
                            input={<Input name={question.name} id="age-native-label-placeholder" />}
                        >
                            {question.choices.map(item => (
                                <option value={item.value}>{item.title}</option>
                            ))}
                        </NativeSelect>
                    </FormControl>
                ))}
                {this.state.textQuestions.map((question, index) => (
                    <div className={classes.container} style={questionlWidth}>
                        <FormControl className={classes.formControl} style={questionlWidth}>
                            <InputLabel htmlFor="component-simple">{question.title}</InputLabel>
                            <Input id="component-simple" value={this.state.textQuestionValue[index]} placeholder={question.placeholder} onChange={this.handleChange(question, index, 'text')}/>
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
