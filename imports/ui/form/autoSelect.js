import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

// const options = [
// 	{ label: 'Chocolate', value: 'chocolate' },
// 	{ label: 'Vanilla', value: 'vanilla' },
// 	{ label: 'Strawberry', value: 'strawberry' },
// 	{ label: 'Caramel', value: 'caramel' },
// 	{ label: 'Cookies and Cream', value: 'cookiescream' },
// 	{ label: 'Peppermint', value: 'peppermint' },
// ];

export default class AutoSelect extends React.Component {

	constructor(props) {
        super(props);
    }

    getInitialState = () => {
    	console.log("getInitialState")
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
    }

    // componentDidMount() {
    //     console.log("AutoSelect componentDidMount-->>");
    //     this.initializeValues();
    // }

    componentWillReceiveProps(nextProps) {
        // console.log("AutoSelect componentWillReceiveProps-->>");
        this.getInitialState();  
    }

    // initializeValues = () => {
    // 	const { defaultData } = this.props
    // 	if(defaultData) {
    // 		console.log("AutoSelect initializeValues-->>",defaultData);
    // 	}
    // } 

    getData = (data) => {
    	console.log("getData data-->>",data)
    	const { fieldobj } = this.props;
    	const { defaultData } = this.props
    	Meteor.call(fieldobj.method, data, (err,res) => {
    	    console.log("AutoSelect res -->>",res);
	    	let value = []
	    	if(defaultData) {
	    		// console.log("AutoSelect initializeValues-->>",defaultData);
	    		value = defaultData.toString();
	    	}
    	    this.setState({
    	    	options: res || [],
    	    	value
    	    })
        })	
    }

    handleChange = (selectedOption) => {
    	console.log("AutoSelect selectedOption-->>",selectedOption)
	    this.setState({ selectedOption });
	    console.log(`Selected: ${selectedOption.label}`);
	}

	handleSelectChange = (value) => {
		console.log('You\'ve selected:', value);
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
        return this.state.value.split(',');
    }

    render() {
    	const { disabled, stayOpen, value, options } = this.state;
    	console.log("AutoSelect state -->>",this.state)
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
				placeholder={`Please Select ${fieldobj.label}`}
	 			removeSelected={this.state.removeSelected}
				rtl={this.state.rtl}
				simpleValue
				value={value}
			/>
	    );
    }
}