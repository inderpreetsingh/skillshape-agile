import HomeBase from './homeBase';
import HomeRender from './homeRender';

export default class Home extends HomeBase {
  render() {
    return HomeRender.call(this, this.props, this.state);
  }
}
