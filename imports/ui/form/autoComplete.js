import React from 'react';
import Autosuggest from 'react-autosuggest';
import AutoSelect from '/imports/ui/form/autoSelect';

let viewClass = {
    AutoSuggestClassName: "autocomplete-container",
    AutoSelectClassName: "autoselect-container form-group",
}

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
        this.initializeValues(nextProps.suggestions, nextProps.suggestionfield);
        
    }

    componentDidUpdate() {
        this.initializeChildValues();
    }

    initializeChildValues = () => {
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
        }, () => {
            if(this.props.onChange) {
                this.props.onChange()
            }
        })
    }

    render() {
    	const { value, suggestions } = this.state;
        const { suggestionfield, fieldobj, data, onChange } = this.props;
    
        return ( 
        	<div className={fieldobj.className ? fieldobj.className : viewClass.AutoSuggestClassName}>
                <Autosuggest
                    
            		suggestions={suggestions}
                    shouldRenderSuggestions={(value) => value && value.trim().length > 0}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            		onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            		onSuggestionSelected={this.onSuggestionSelected}
                    inputProps={{...this.props, value, onChange: this.onChange, placeholder: fieldobj.placeHolder ? fieldobj.placeHolder : ""}}
                    getSuggestionValue={(suggestion) => {
                        return suggestion[suggestionfield];
                    }}
                    renderSuggestion={(suggestion)=> {
                       return <div>{suggestion[suggestionfield]}</div>
                    }}
            	/>
                { 
                    fieldobj.child && (
                        <div className={fieldobj.child.className ? fieldobj.child.className : viewClass.AutoSuggestClassName}>
                            {
                                fieldobj.child.label && (
                                    <label>
                                        fieldobj.child.label {fieldobj.child.required && "*"}
                                    </label>
                                )
                            }
                            <AutoSelect
                                className="form-control form-mandatory"
                                ref={"autoSelect"}
                                fieldobj={fieldobj.child}
                                onChange={onChange}
                                defaultData={data && data[fieldobj.child.key]}
                            />
                        </div>
                    )
                }
            </div>    
        )
    }
}