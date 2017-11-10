import React from 'react';

export class ClaimSchoolModal extends React.Component{

  constructor(props){
    super(props);
    this.state = {}
  }

  render() {
    console.log("ClaimSchoolModal render")
    return (
      <div className="modal fade " role="dialog">
        <div className="modal-dialog" style={{maxWidth: '450px'}}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="bootstrap-dialog-header">
                <div className="bootstrap-dialog-close-button" style={{display: 'block'}}>
                  <button className="close">×</button>
                </div>
                <div className="bootstrap-dialog-title">
                  This school is already claimed. Do you want to continue?
                </div>
              </div>
            </div>
          <div className="modal-body" style={{minHeight: '202px'}}>
            <div className="bootstrap-dialog-body">
              <div className="bootstrap-dialog-message"></div>
            </div>
          </div>
          <div className="modal-footer" style={{display: 'block'}}>
            <div className="bootstrap-dialog-footer">
              <div className="bootstrap-dialog-footer-buttons">
                <button className="btn btn-default" >No</button>
                <button className="btn btn-success btn_wi">Yes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}