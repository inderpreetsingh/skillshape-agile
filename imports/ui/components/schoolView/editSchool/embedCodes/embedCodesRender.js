import React from "react";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import Card, { CardContent } from "material-ui/Card";
import PanelHeader from "/imports/ui/components/schoolView/editSchool/priceDetails/panelHeader";

import { CopyToClipboard } from "react-copy-to-clipboard";
import embedCodeSettings from "./embedCodeSettings";

export default function() {
  const { schoolData, moveTab } = this.props;
  return (
    <div className="tab-pane active" id="tab_default_10">
      <PanelHeader
        caption="These codes will allow you to put your classes, prices, calendar, and images on your site.
				Simply copy the code and paste it into the text area or code area of any page on your website. Let us know if there are any issues!
				notices@SkillShape.com"
        icon="code"
      />
      <div className="col-md-12">
        {embedCodeSettings.map((setting, index) => {
          let code =
            Meteor.absoluteUrl(
              `embed/schools/${schoolData.slug}/${setting.codeName}`
            ) + "?height=800";
          let script = `<script type="text/javascript">function calculateTopOfModal(offset) { console.log("offset from parent",offset);var windowOffset = window.pageYOffset; console.log("windowOffset",windowOffset);window.scrollTo(0,offset/2);};function setIframeHeightCO(id,ht){var ifrm=document.getElementById(id);ifrm.style.visibility='hidden';ifrm.style.height=ht+4+"px";ifrm.style.visibility='visible'};function handleDocHeightMsg(e){console.log("<<<<<<<<<<<<<---------------------------->>>>>>>>>>>>>",e);if("http://localhost:3000/"==(e.origin+"/")){var data=JSON.parse(e.data);if(data.popUpOpened) {calculateTopOfModal(data.offset);}if(data.docHeight){setIframeHeightCO(data.iframeId,data.docHeight)}}};if(window.addEventListener){window.addEventListener('message',handleDocHeightMsg,!1)}else if(window.attachEvent){window.attachEvent('onmessage',handleDocHeightMsg)}</script>`;
          let value = `${script}<iframe id=${
            setting.id
          } src=${code} seamless="seamless" name="skillshape" frameborder="0" scrolling="no" style="width: 100%;min-height:400px;"></iframe>`;
          return (
            <Grid container>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Grid item xs={12}>
                      <Typography type="headline">{setting.title}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <textarea
                        value={value}
                        style={{
                          width: "100%",
                          paddingTop: "1%",
                          paddingBottom: "1%",
                          resize: "none"
                        }}
                        onChange={() => this.setState({ value, copied: false })}
                        id="iframe_code_textarea"
                        className="form-group form-control embed-code_box"
                        data-gramm="true"
                        spellCheck="false"
                        data-gramm_editor="true"
                        disabled="disabled"
                      />
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: "right" }}>
                      <CopyToClipboard
                        text={value}
                        onCopy={() => {
                          toastr.success("Code Copied", "Success");
                        }}
                      >
                        <Button color="default" raised dense>
                          Copy to clipboard
                        </Button>
                      </CopyToClipboard>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            /*<div key={index} className="col-sm-12 card" style={{paddingBottom: '20px'}}>

				                <div className="col-sm-12" id="iframe_code">
				                </div>
				            </div>*/
          );
        })}
      </div>
      <div className="pull-right">
        <input
          type="button"
          className="btn btn-finish btn-fill btn-rose btn-wd"
          name="finish"
          value="Finish"
          style={{ display: "none" }}
        />
      </div>
      <div className="clearfix" />
    </div>
  );
}
