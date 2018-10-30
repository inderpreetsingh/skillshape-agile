import ClassTime from '/imports/ui/components/landing/components/classTimes/ClassTime';
// import ClassTimeNew from '/imports/ui/components/landing/components/classTimes/ClassTimeNew.jsx';
import withSlider from '/imports/util/withSlider.js';


const config = {
  desktop: 4,
  tablet: 2,
  mobile: 1,
  autoplay: false,
  arrows: true
}

const breakPoints = {
  mobile: 601,
}

export default withSlider(ClassTime,config,breakPoints);
