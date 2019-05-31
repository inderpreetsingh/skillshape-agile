import Review from './Review';
import { mobile, tablet } from '/imports/ui/components/landing/components/jss/helpers';
import withSlider from '/imports/util/withSlider';

const config = {
  desktop: 3,
  tablet: 2,
  mobile: 1,
};

const breakPoints = {
  mobile: mobile + 121,
  tablet: tablet + 121,
};

export default withSlider(Review, config, breakPoints);
