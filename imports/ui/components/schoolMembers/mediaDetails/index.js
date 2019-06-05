import SchoolMemberMediaRender from './schoolMemberMediaRender';
import SchoolMemberDetails from '/imports/api/schoolMemberDetails/fields';
import MediaDetails from '/imports/ui/components/schoolView/editSchool/mediaDetails';

class SchoolMemberMedia extends MediaDetails {
  constructor(props) {
    super(props);
    this.state = {
      memberInfo:
        this.props.schoolMemberDetailsFilters
        && SchoolMemberDetails.findOne(this.props.schoolMemberDetailsFilters),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.schoolMemberDetailsFilters) {
      this.setState({
        memberInfo: SchoolMemberDetails.findOne(nextProps.schoolMemberDetailsFilters),
      });
    }
  }

  handleDialogState = (dBoxName, dBoxState) => (e) => {
    this.setState(state => ({
      ...state,
      [dBoxName]: dBoxState,
    }));
  };

  render() {
    return SchoolMemberMediaRender.call(this, this.props, this.state);
  }
}

export default SchoolMemberMedia;
