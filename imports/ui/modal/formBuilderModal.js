import React from 'react';

export class FormBuilderModal extends React.Component {

  constructor(props){
    super(props);
    let { formFieldsValues } = this.props;
    if(formFieldsValues) {
      this.state = {
        ...formFieldsValues
      }
    }
  }

  componentDidMount() {
    this.handleModal();   
  }

  componentWillReceiveProps(newProps) {
    console.log("FormBuilderModal componentWillReceiveProps 1",newProps)
    if(newProps.formFieldsValues)
      this.state = {...newProps.formFieldsValues};
    else 
      this.state = {};
    this.setState()
    this.handleModal();
  }

  handleModal = () => {
    $('#FormBuilderModal').appendTo("body").modal('show')
    $('#FormBuilderModal').on('hidden.bs.modal', () => {
      $('#FormBuilderModal').modal('hide')
    })    
  }

  getFooterButton = (type) => {
    const { callApi } = this.props
    let btnArray = [];
    if(type === "Edit") {
      btnArray.push(<button onClick={() => {this.props.onSubmit(this.state, callApi)}} key={`${type}-save`} type="button" className="btn btn-default"  data-action="edit">
        Save
      </button>)
      btnArray.push(<button key={`${type}-cancel`} type="button" className="btn btn-default" data-dismiss="modal">
        Cancel 
      </button>)
    } else if(type == "Add") {
      btnArray.push(<button onClick={() => {this.props.onSubmit(this.state, callApi)}} key={type} type="button" className="btn btn-default">
        ADD
      </button>)
    }

    return btnArray
  }

  render() {
    console.log("FormBuilderModal render",this.props)
    console.log("FormBuilderModal state",this.state)
    const {
      className,
      headerTitle,
      modalType,
      formFields,
      formFieldsValues,
    } = this.props

    return (
      <div className="modal fade " id="FormBuilderModal" role="dialog">
        <div className="modal-dialog" style={{maxWidth: '550px'}}>
          <div className={`modal-content ${className}`}>
            
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">×</button>
              <h4 className="modal-title">{headerTitle}</h4>
            </div>
            
            <div className="modal-body">
              <form className="formmyModal">
                {
                  formFields.map((field, index) => {
                    let fieldName = field["key"];
                    // console.log("fieldName -->>",fieldName)
                    return (
                      <div key={index} className="form-group">
                        <label>
                          {field.label} {field.required && "*"}
                        </label>
                        <input 
                          type={field.type} 
                          className="form-control form-mandatory " 
                          onChange={(e) => this.setState({ [fieldName]: e.target.value})}
                          value={this.state && this.state.hasOwnProperty(fieldName) ? this.state[field["key"]] : ""}
                        />
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