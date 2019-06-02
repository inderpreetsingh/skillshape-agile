import SkillClassListBase from './skillClassListBase';
import SkillClassListRender from './skillClassListRender';
import ClassType from '/imports/api/classType/fields';
import { withSubscriptionAndPagination } from '/imports/util';

class SkillClassList extends SkillClassListBase {
  render() {
    return SkillClassListRender.call(this, this.props, this.state);
  }
}

export default withSubscriptionAndPagination(SkillClassList, {
  collection: ClassType,
  subscriptionName: 'school.getClassTypesByCategory',
  filter: {},
  recordLimit: 10,
});
