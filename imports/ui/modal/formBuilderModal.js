import React from 'react';
import methods from './formBuilderMethods';
import config from '/imports/config';
import AutoComplete from '/imports/ui/form/autoComplete';
import AutoSelect from '/imports/ui/form/autoSelect';

const formId = "form-builder";

export class FormBuilderModal extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        isBusy: false,
    }
  }

  componentDidMount() {
    this.initializeFormValues();   
  }

  componentDidUpdate() {
    this.initializeFormValues();  
  }

  componentWillReceiveProps(nextProps) {
  }

  getFormFields = () => {
    let formFields;
    let { tableData, formFieldsValues } = this.props;
    if(tableData && tableData.actions.formFields) {
      formFields = tableData.actions.formFields 
    } else if(tableData && tableData.actions.edit.formFields) {
      formFields = tableData.actions.edit.formFields
    }
    return formFields
  }

  initializeFormValues = () => {
    let { formFieldsValues } = this.props;
    let formFields = this.getFormFields();
    if(formFields) {
      for(let field of formFields) {
        let value = formFieldsValues && formFieldsValues[field.key]
        
        if(field.type === "image") {
          
          this.refs[`${field.key}_src`].src = value ? value : config.defaultSchoolImage;
          this.refs[field.key].value = null;
          $(this.refs[field.key]).change();

        } else {
          this.refs[field.key].value = value ? value : null;
        }
      }
    }
  }

  show = () => {
    $('#FormBuilderModal').appendTo("body").modal('show')
    $('#FormBuilderModal').on('hidden.bs.modal', () => {
      $('#FormBuilderModal').modal('hide')
    })    
  }

  hideModal = () => {
    this.setState({isBusy:false})
    $('#FormBuilderModal').appendTo("body").modal('hide');
  }

  getHeaderName = () => {
    let { tableData } = this.props;
    let name;
    if(tableData && tableData.actions.title) {
      name = tableData.actions.title;
    } else if(tableData && tableData.actions.edit.title) {
      name = tableData.actions.edit.title;
    }
    return name;  
  }

  getFooterButton = (type) => {
    const { callApi } = this.props
    let btnArray = [];
    if(type === "Edit") {
      btnArray.push(<button 
        key={`${type}-save`} 
        form={formId}
        type="submit"  
        className="btn btn-default"  
        data-action="edit"
      >
        Save
      </button>)
      btnArray.push(<button 
        key={`${type}-cancel`} 
        type="button" 
        className="btn btn-default" 
        data-dismiss="modal"
      >
        Cancel 
      </button>)
    } else if(type == "Add") {
      btnArray.push(<button  
        key={type}
        form={formId} 
        type="submit" 
        className="btn btn-default"
      >
        ADD
      </button>)
    }

    return btnArray
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.setState({isBusy:true})
    let editByFieldValue;
    let parentKeyValue;
    let callApi;
    const {  
      modalType, 
      tableData, 
      formFieldsValues,
      parentData,       
    } = this.props;
    
    if(tableData && tableData.actions.onSubmit) {
      callApi = tableData.actions.onSubmit;
    } else if(tableData && tableData.actions.edit.onSubmit) {
      callApi = tableData.actions.edit.onSubmit;
    } 

    if(!callApi && !Meteor.userId()) {
      
      toastr.error("Something went wrong.","Error");
      return

    } else {
      
      let payload = {};
      let formFields = this.getFormFields()
      
      for(let formField of formFields) {
        
        switch(formField.type) {

          case "image": {
              payload[formField.key] = this.refs[formField.key].files[0];
              break;
            }

          case "auto-select": {
            let autoSelectValue = this.refs[formField.key].getValue()
            if(!autoSelectValue && formField.required) {
                toastr.error(`Please select any ${formField.label}`,"Error");
                return
            }

            payload[formField.key] = autoSelectValue;
            break;
          }

          case "autoComplete": {

            let temp = this.refs[formField.key].getSelectedAutoCompleteValue()
            if(!temp && formField.required) {
              toastr.error(`Please select any ${formField.label}`,"Error");
              return
            }
          
            payload[formField.key] = temp[formField.valueField];

            if(formField.child) {
              let temp = this.refs[formField.key].getAutoSelectValue()
              if(!temp && formField.child.required) {
                toastr.error(`Please select any ${formField.child.label}`,"Error");
                return
              }
            
              payload[formField.child.key] = this.refs[formField.key].getAutoSelectValue();
            }
            break;
          }
           
          default: {
            let fieldValue = this.refs[formField.key].value;
            if(formField.type === "number" && fieldValue) {
                fieldValue = parseInt(fieldValue);
            }
            payload[formField.key] = fieldValue;
            break;
          }    
        }

      }

      if(parentData && tableData && tableData.actions.parentKey) {
        parentKeyValue = parentData[tableData.actions.parentKey];
      }

      if(modalType === "Edit" && tableData && tableData.actions.edit.editByField) {
        editByFieldValue = formFieldsValues[tableData.actions.edit.editByField];
      }

      methods[callApi]({formPayload: payload, props: this.props, closeModal: this.hideModal.bind(this), editByFieldValue, parentKeyValue});

    }
  }

  getFilters = (filterArr) => {
    let filters = {};
    for(let i=0; i < filterArr.length; i++) {
      filters[filterArr[i]] = this.props[filterArr[i]];
    }
    return filters
  }

  getInputField = (field) => {
    let { formFieldsValues } = this.props;
    switch(field.type) {

      case "text":
        return (<input 
          type={field.type}
          required={field.required} 
          className="form-control form-mandatory"
          ref={field.key}
        />)
      case "number": 
        return (<input 
          type={field.type}
          required={field.required} 
          className="form-control form-mandatory"
          ref={field.key}
        />) 
      case "select":
        return (<select
          type={field.type}
          required={field.required} 
          className="form-control form-mandatory "
          ref={field.key}
        >
          { 
            field.defaultOption && <option disabled defaultValue={field.options[0].value}>{field.defaultOption}</option>
          }
          { 
            field.options.map((option, i) => {
              return (<option key={i} value={`${option.value}`}>{option.label}</option>)
            }) 
          }
        </select>)
      case "textArea":
        return (
          <textarea
            type={field.type}
            required={field.required} 
            ref={field.key} 
            className="form-control" 
          >
          </textarea>
        )
      case "autoComplete": 
        return (<AutoComplete
            type={field.type}
            fieldobj={field}
            required={field.required} 
            className="form-control form-mandatory"
            ref={field.key}
            methodname={field.method}
            suggestionfield={field.suggestion}
            suggestions={formFieldsValues && formFieldsValues[field.objKey]}
            data={formFieldsValues}
          />
        )
      case "auto-select":
        return (<AutoSelect
            className="form-control form-mandatory"
            ref={field.key}
            fieldobj={field}
            defaultData={formFieldsValues && formFieldsValues[field.key]}
            methodFilters={field.filterKeys && this.getFilters(field.filterKeys)}
          />
        )  
      case "image": 
        return (
          <div className="" style={{textAlign: 'center'}}>
            <div className="fileinput fileinput-new card-button text-center" data-provides="fileinput">
              <div className="fileinput-new card-button thumbnail">
                <img className="" ref={`${field.key}_src`} alt="Profile Image" />
              </div>
              <div className="fileinput-preview fileinput-exists thumbnail">
              </div>
              <div>
                <span className="btn btn-warning btn-sm btn-file">
                  <span className="fileinput-new">Upload New Image</span>
                  <span className="fileinput-exists">Change</span>
                  <input type="hidden"/>
                  <input type="file" name="..." ref={field.key} accept="image/*"/>
                </span>
                <a href="#" className="btn btn-danger btn-sm btn-file fileinput-exists" data-dismiss="fileinput">
                  Remove
                </a>
              </div>
            </div>
          </div>
        )
      default:
        return null   
    } 
  }

  render() {
    let {
      className,
      modalType,
    } = this.props;

    let formFields = this.getFormFields()
    
    if(!formFields) {
      return <div></div>
    }

    return (
      <div className="modal fade " id="FormBuilderModal" role="dialog">
        <div className="modal-dialog" style={{maxWidth: '650px'}}>
          <div className={`modal-content ${className}`}>
            
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">×</button>
              <h4 className="modal-title">{this.getHeaderName()}</h4>
            </div>
            
            <div className="modal-body">
              
              <form id={formId} className="formmyModal" onSubmit={this.onSubmit}>
                {
                  formFields.map((field, index) => {
                    return (
                      <div key={index} className={field.type !== "image" ? "form-group": null }>
                        <label>
                          {field.label} {field.required && "*"}
                        </label>
                        {this.getInputField(field)}
                        <span className="material-input"></span>
                      </div>
                    )
                  })
                }
              </form>
              
            </div>

            <div className="modal-footer">
              {
                this.getFooterButton(modalType) 
              }
            </div>

          </div>
        </div>
      </div>
    )
  }
}