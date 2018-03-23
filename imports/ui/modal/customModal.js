import React from 'react';
import "/imports/ui/css/customModal.css"; 

export class CustomModal extends React.Component{

  constructor(props){
    super(props);
    this.state = {}
  }

  componentDidMount() {
    $('#CustomModal').modal('show')
    $('#CustomModal').on('hidden.bs.modal', () => {
      this.props.onClose();
    })    
  }

  render() {
    console.log("CustomModal render",this.props)
    const {
      className,
      title,
      message,
      closeBtnLabel,
      submitBtnLabel,
    } = this.props

    return (
      <div className="modal fade " id="CustomModal" role="dialog">
        <div className="modal-dialog" style={{maxWidth: '550px'}}>
          <div className={`modal-content ${className}`}>
            
            <div className={`modal-header ${className}-header`} >
              <button type="button" className="close" onClick={this.props.onClose} data-dismiss="modal">&times;</button>
              <h4 className="modal-title" style={{textAlign: 'center', color: 'white'}}>{title}</h4>
            </div>
            
            <div className={`modal-body ${className}-body`}>
              <p style={{textAlign: 'center'}}>{message}</p>
            </div>
            
            <div className={`modal-footer ${className}-footer`}>
              <div className={`bootstrap-dialog-footer-buttons ${className}-footer-buttons`} style={{textAlign: 'center'}}>
                <button className={`btn btn-default ${className}-close-btn`} onClick={this.props.onClose} >{closeBtnLabel}</button>
                <button className={`btn btn-success btn_wi ${className}-submit-btn`} onClick={this.props.onSubmit}>{submitBtnLabel}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}