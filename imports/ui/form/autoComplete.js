import React from 'react';
import Autosuggest from 'react-autosuggest';
import AutoSelect from '/imports/ui/form/autoSelect';

export default class AutoComplete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
            selectedValue: null,
        }
    }

    componentWillMount() {
        const { suggestions, suggestionfield } = this.props;
        if(suggestions && suggestionfield) {
            this.initializeValues(suggestions, suggestionfield);
        }
    }

    componentDidMount() {
        this.initializeChildValues();
    }

    componentWillReceiveProps(nextProps) {
        console.log("AutoComplete componentWillReceiveProps-->>",nextProps);
        this.initializeValues(nextProps.suggestions, nextProps.suggestionfield);
        
    }

    componentDidUpdate() {
        this.initializeChildValues();
    }

    initializeChildValues = () => {
        console.log("AutoComplete initializeChildValues state-->>",this.state);
        console.log("AutoComplete initializeChildValues props-->>",this.props);
        const { fieldobj } = this.props;
        const { selectedValue } = this.state;
        if(fieldobj.child && selectedValue) {
            this.refs.autoSelect.getData({ 
                [fieldobj.key]: selectedValue[fieldobj.valueField]
            });
        }
    }

    initializeValues = (suggestions, suggestionfield) => {
        this.setState({
            value: (suggestions && suggestions[suggestionfield]) ?  suggestions[suggestionfield]: '',
            suggestions: suggestions ? [suggestions] : [],
            selectedValue: suggestions ? suggestions : null,
        })
    }

    onChange = (event, { newValue }) => {
        console.log("AutoComplete onChange-->>", newValue)
        const { fieldobj } = this.props;
        if(fieldobj.child) {
            this.refs.autoSelect.getInitialState();
        }
        this.setState({
            value: newValue
        })
    }

    getSelectedAutoCompleteValue = () => {
        return this.state.selectedValue
    }

    getAutoSelectValue = () => {
        return this.refs.autoSelect.getValue();
    }

    onSuggestionsFetchRequested = ({ value }) => {
        Meteor.call(this.props.methodname,{textSearch: value}, (err,res) => {
    	    this.setState({
    	      suggestions: res || []
    	    })
        })
	}

	onSuggestionsClearRequested = () => {
	    this.setState({
	      suggestions: []
	    })
	}

    onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
        const { fieldobj } = this.props;
        if(fieldobj.child) {
            this.refs.autoSelect.getData({ 
                [fieldobj.key]: suggestion[fieldobj.valueField]
            });
        }
        this.setState({
            selectedValue: suggestion
        })
    }

    render() {
    	const { value, suggestions } = this.state;
        const { suggestionfield, fieldobj, data } = this.props;
        console.log("AutoComplete render props-->>",this.props);
        console.log("AutoComplete render state-->>",this.state);
        return ( 
        	<div>
                <Autosuggest
            		suggestions={suggestions}
                    shouldRenderSuggestions={(value) => value && value.trim().length > 0}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            		onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            		onSuggestionSelected={this.onSuggestionSelected}
                    inputProps={{...this.props, value, onChange: this.onChange}}
                    getSuggestionValue={(suggestion) => {
                        return suggestion[suggestionfield];
                    }}
                    renderSuggestion={(suggestion)=> {
                       return <div>{suggestion[suggestionfield]}</div>
                    }}
            	/>
                { 
                    fieldobj.child && (
                        <div className="form-group">
                            <label>
                              {fieldobj.child.label} {fieldobj.child.required && "*"}
                            </label>
                            <AutoSelect
                                className="form-control form-mandatory"
                                ref={"autoSelect"}
                                fieldobj={fieldobj.child}
                                defaultData={data && data[fieldobj.child.key]}
                            />
                        </div>
                    )
                }
            </div>    
        )
    }
}