import React , {Component} from 'react';
import { get, isEmpty} from 'lodash';
import { imageExists } from '/imports/util';

/* config Object
 @param {string} originalImagePath : path of the object on this.props from where we get the image,
 @param {string} defaultImage : path of the default image
*/

export default withImageExists = (WrappedComponent,config) => {
  return class extends Component {
    state = {
      bgImg: get(this.props,config.originalImagePath,config.defaultImage)
    }

    _setbgImg = (imgSrc) => {
      imageExists(imgSrc).then(() => {
        if(this.state.bgImg !== imgSrc)
  			   this.setState({ bgImg: imgSrc});
  		}).catch(e => {
        if(this.state.bgImg !== config.defaultImage)
          this.setState({ bgImg: config.defaultImage });
  		});
  	}

    componentDidMount = () => {
      this._setbgImg(get(this.props,config.originalImagePath,""));
    }

    componentWillReceiveProps = (nextProps) => {
  		if(!isEmpty(get(nextProps,config.originalImagePath,""))) {
        this._setbgImg(get(nextProps,config.originalImagePath,""));
        // if(get(this.props,config.originalImagePath,"") != get(nextProps,config.originalImagePath,"")) {
				// 	this._setbgImg(get(nextProps,config.originalImagePath,""));
				// }
  		}
  	}

    render() {
      console.info("with image exists ,hoc",config);
      return(<WrappedComponent {...this.props} bgImg={this.state.bgImg} />)
    }
  }
}
