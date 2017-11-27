import React from 'react';
import Autosuggest from 'react-autosuggest';

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

    componentWillReceiveProps(nextProps) {
        if(nextProps.suggestions && nextProps.suggestionfield) {
            this.initializeValues(nextProps.suggestions, nextProps.suggestionfield);
        }
    }

    initializeValues = (suggestions, suggestionfield) => {
        this.setState({
            value: suggestions ?  suggestions[suggestionfield]: '',
            suggestions: suggestions ? [suggestions] : [],
            selectedValue: suggestions ? suggestions : null,
        })
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        })
    }

    getSelectedAutoCompleteValue = () => {
        return this.state.selectedValue
    }

    onSuggestionsFetchRequested = ({ value }) => {
        Meteor.call(this.props.methodname,{textSearch: value}, (err,res) => {
    	    this.setState({
    	      suggestions: res
    	    })
        })
	}

	onSuggestionsClearRequested = () => {
	    this.setState({
	      suggestions: []
	    })
	}

    onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
        this.setState({
            selectedValue: suggestion
        })
    }

    render() {
    	const { value, suggestions } = this.state;
        const { suggestionfield } = this.props;
        return ( 
        	<Autosuggest
        		suggestions={suggestions}
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
        )
    }
}