import React from 'react';
import methods from './formBuilderMethods';
import config from '/imports/config';
import AutoComplete from '/imports/ui/form/autoComplete';

const formId = "form-builder";

export class FormBuilderModal extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.initializeFormValues();   
  }

  componentDidUpdate() {
    this.initializeFormValues();  
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
    // console.log("initializeFormValues formFields-->>", formFields);
    // console.log("initializeFormValues formFieldsValues-->>", formFieldsValues);
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
      
      for(formField of formFields) {
        if(formField.type === "image") {
          payload[formField.key] = this.refs[formField.key].files[0];
        } else if(formField.type === "autoComplete") {
          let temp = this.refs[formField.key].getSelectedAutoCompleteValue()
          if(!temp) {
            toastr.error(`Please select any ${formField.label}`,"Error");
            return
          }
          payload[formField.key] = temp[formField.valueField];
        } else {
          payload[formField.key] = this.refs[formField.key].value;
        }
      }

      if(parentData && tableData && tableData.actions.parentKey) {
        parentKeyValue = parentData[tableData.actions.parentKey];
      }

      if(modalType === "Edit" && tableData && tableData.actions.edit.editByField) {
        editByFieldValue = formFieldsValues[tableData.actions.edit.editByField];
      }

      console.log("payload -->>",payload)
      console.log("callApi -->>",callApi, methods[callApi])
      methods[callApi]({formPayload: payload, props: this.props, closeModal: this.hideModal.bind(this), editByFieldValue, parentKeyValue});

    }
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

      case "select":
        return (<select
          type={field.type}
          required={field.required} 
          className="form-control form-mandatory "
          ref={field.key}
        >
          { 
            field.defaultOption && <option disabled selected>{field.defaultOption}</option>
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
            required={field.required} 
            className="form-control form-mandatory"
            ref={field.key}
            methodname={field.method}
            suggestionfield={field.suggestion}
            suggestions={formFieldsValues && formFieldsValues[field.objKey]}
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
    console.log("FormBuilderModal render",this.props)
    // console.log("FormBuilderModal state",this.state)
    // console.log("FormBuilderModal ref",this.refs)
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
        <div className="modal-dialog" style={{maxWidth: '550px'}}>
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