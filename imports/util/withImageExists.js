import React , {Component} from 'react';
import { get, isEmpty} from 'lodash';
import { imageExists } from '/imports/util';

/* config Object
 @param {string} image : path of the object on this.props from where we get the image,
 @param {defaultImg} : path of the default image
*/

export default withImageExists = (WrappedComponent,config) => {
  return class extends Component {
    state = {
      bgImg: get(this.props,config.image,config.defaultImg)
    }

    _setbgImg = (imgSrc) => {
      imageExists(imgSrc).then(() => {
  			this.setState({ bgImg: imgSrc});
  		}).catch(e => {
        this.setState({ bgImg: config.defaultImg });
  		});
  	}

  	componentDidMount = () => {
  		const self = this;
  		// console.log(this.props,"dsa");
  		if(!isEmpty( get(this.props,config.image,"") )) {
  			this._setbgImg( get(this.props,config.image,""));
  		}
  	}

  	componentWillReceiveProps = (nextProps) => {
  		if(!isEmpty(get(nextProps,config.image,""))) {
  			if(!isEmpty(get(nextProps,config.image,""))) {
  				if(get(this.props,config.image,"") != get(nextProps,config.image,"")) {
  					this._setbgImg(get(nextProps,config.image,""));
  				}
  			}else {
  				this._setCoverSrc(get(nextProps,config.image,""));
  			}
  		}
  	}

    render() {
      console.info("with image exists ,hoc",config);
      return(<WrappedComponent {...this.props} bgImg={this.state.bgImg} />)
    }
  }
}
