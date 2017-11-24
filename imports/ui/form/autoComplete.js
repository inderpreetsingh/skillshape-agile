import React from 'react';
import Autosuggest from 'react-autosuggest';

const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);

const getSuggestionValue = suggestion => suggestion.name;

export default class AutoComplete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: []
        };
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        })
    }

    onSuggestionsFetchRequested = ({ value }) => {
	    this.setState({
	      suggestions: [
	      	{
			    name: 'Gaurav',
			    year: 1972
			},
			{
			    name: 'Ramesh',
			    year: 1972
			}
			]
	    })
	}

	onSuggestionsClearRequested = () => {
	    this.setState({
	      suggestions: []
	    })
	}

    render() {
    	const { value, suggestions } = this.state;

        return ( 
        	<Autosuggest
        		suggestions={suggestions}
        		onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        		onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        		getSuggestionValue={getSuggestionValue}
        		renderSuggestion={renderSuggestion}
        		inputProps={{...this.props, value, onChange: this.onChange}}
        	/>
        )
    }
}