import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class AutoSelect extends React.Component {

	constructor(props) {
        super(props);
    }

    getInitialState = () => {
    	const { fieldobj, methodFilters } = this.props;
    	if(fieldobj && fieldobj.onLoad) {
    		this.getData(methodFilters)
    	}
		this.setState({
			removeSelected: true,
			disabled: false,
			crazy: false,
			stayOpen: false,
			value: [],
			options: [],
			rtl: false,
		})
	}

    componentWillMount() {
    	this.getInitialState();
    	this.defaultData = this.props.defaultData;
    }

    componentWillReceiveProps(nextProps) {
        this.defaultData = nextProps.defaultData
        this.getInitialState();  
    }

    getData = (data) => {
    	const { fieldobj } = this.props;
    	Meteor.call(fieldobj.method, data, (err,res) => {
    	    // console.log("AutoSelect res -->>",res);
	    	let value = []
	    	if(this.defaultData) {
	    		console.log("AutoSelect initializeValues-->>",this.defaultData);
	    		value = this.defaultData.toString();
	    	}
    	    this.setState({
    	    	options: res || [],
    	    	value
    	    })
        })	
    }

    handleChange = (selectedOption) => {
	    this.setState({ selectedOption });
	    console.log(`Selected: ${selectedOption.label}`);
	}

	handleSelectChange = (value) => {
		this.setState({ value });
	}
	
	toggleCheckbox = (e) => {
		this.setState({
			[e.target.name]: e.target.checked,
		});
	}
	
	toggleRtl = (e) => {
		let rtl = e.target.checked;
		this.setState({ rtl });
	}

	getValue = () => {
		if(_.isEmpty(this.state.value))
			return null;
        return this.state.value.split(',');
    }

    render() {
    	const { disabled, stayOpen, value, options } = this.state;
    	const { fieldobj } = this.props;
	    
	    return (
		    <Select
		    	valueKey={fieldobj.valueField}
		    	labelKey={fieldobj.suggestion}
				closeOnSelect={!stayOpen}
				disabled={disabled}
				multi={fieldobj.multi}
				onChange={this.handleSelectChange}
				options={options}
				placeholder={fieldobj.label && `Please Select ${fieldobj.label}`}
	 			removeSelected={this.state.removeSelected}
				rtl={this.state.rtl}
				simpleValue
				value={value}
			/>
	    );
    }
}