import PropTypes from 'prop-types';
import ListBase from './listBase';
import ListRender from './listRender';

export default class ListView extends ListBase {
  render() {
    return ListRender.call(this, this.props, this.state);
  }
}

ListView.propTypes = {
  className: PropTypes.string.isRequired,
  backgroundUrl: PropTypes.string.isRequired,
};
