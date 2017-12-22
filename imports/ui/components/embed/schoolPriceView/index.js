import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Card} from 'material-ui/Card';
import { TableRow, TableRowColumn } from "material-ui/Table";
import School from '/imports/api/school/fields';
import ClassPricing from '/imports/api/classPricing/fields';
import ClassType from '/imports/api/classType/fields';
import MonthlyPricing from '/imports/api/monthlyPricing/fields';
import { ClassPriceTable } from './classPriceTable';
import { MonthlyPriceTable } from './monthlyPriceTable';

class SchoolPriceView extends React.Component {

  constructor( props ) {
    super( props );
  }

  getClassName = (classTypeId) => {
    console.log("SchoolPriceView getClassName classTypeId-->>",classTypeId)
    if(_.isArray(classTypeId)) {
      let str_name = []
      // let classTypeIds = classTypeId.split(",")
      let classTypeList = ClassType.find({_id:{$in:classTypeId}}).fetch();
      classTypeList.map((a) => { str_name.push(a.name)})
      return str_name.join(",")
    } else {
      return ""
    }
  }

  render( ) {
    console.log("SchoolPriceView props-->>",this.props);
    console.log("ClassPriceTable props-->>",ClassPriceTable);
    console.log("MonthlyPriceTable props-->>",MonthlyPriceTable);
    const { classPricing, monthlyPricing } = this.props;  
    return (
        <div className="wrapper" style={{padding: 20}}>
            <Card style={{margin: 10}}>
                <ClassPriceTable>
                    {
                        !_.isEmpty(classPricing) ? classPricing.map((data, index) => {
                            return (
                                <TableRow key={index} selectable={false} displayBorder={false}>
                                    <TableRowColumn>
                                        {data.packageName}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {data.cost}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {this.getClassName(data.classTypeId)}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {data.noClasses}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {
                                            (data.start && data.finish) ? `${data.start} ${data.finish}` :
                                              "Check with School"
                                        }
                                    </TableRowColumn>
                                </TableRow>
                            )
                        }) : (
                            <TableRow selectable={false} displayBorder={false}>
                                <TableRowColumn style={{textAlign: 'center', color: 'red'}}>
                                    No Record Found        
                                </TableRowColumn>
                            </TableRow>
                        )
                    }
                </ClassPriceTable>
            </Card>
            <Card style={{margin: 10}}>
                <MonthlyPriceTable>
                    {
                        !_.isEmpty(monthlyPricing) ? monthlyPricing.map((data, index) => {
                            return (
                                <TableRow key={index} selectable={false} displayBorder={false}>
                                    <TableRowColumn>
                                        {data.packageName}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        { 
                                            data.pymtType ? data.pymtType 
                                            : <span className="text-warning link">check with school</span>
                                        }
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {this.getClassName(data.classTypeId)}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {
                                          data.oneMonCost ? 
                                          <span className="btn-info">{data.oneMonCost}</span> :
                                          <span className="text-warning link"> check with school</span>
                                        }
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {
                                          data.threeMonCost ? 
                                          <span className="btn-info">{data.threeMonCost}</span> :
                                          <span className="text-warning link"> check with school</span>
                                        }
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {
                                          data.sixMonCost ? 
                                          <span className="btn-info">{data.sixMonCost}</span> :
                                          <span className="text-warning link"> check with school</span>
                                        }
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {
                                          data.annualCost ? 
                                          <span className="btn-info">{data.annualCost}</span> :
                                          <span className="text-warning link"> check with school</span>
                                        }
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {
                                          data.lifetimeCost ? 
                                          <span className="btn-info">{data.lifetimeCost}</span> :
                                          <span className="text-warning link"> check with school</span>
                                        }
                                    </TableRowColumn>
                                </TableRow>
                            )
                        }) : (
                            <TableRow selectable={false} displayBorder={false}>
                                <TableRowColumn style={{textAlign: 'center', color: 'red'}}>
                                    No Record Found        
                                </TableRowColumn>        
                            </TableRow>
                        )
                    }
                </MonthlyPriceTable>
            </Card>
        </div>
    )
  }
}

export default createContainer(props => {
    const { slug } = props.params;
    
    Meteor.subscribe("UserSchoolbySlug", slug);
    
    const schoolData = School.findOne({slug: slug})
    const schoolId = schoolData && schoolData._id
    
    Meteor.subscribe("classPricing.getClassPricing", {schoolId})
    Meteor.subscribe("monthlyPricing.getMonthlyPricing", {schoolId})

    const classPricing = ClassPricing.find({schoolId: schoolId}).fetch() 
    const monthlyPricing = MonthlyPricing.find({schoolId: schoolId}).fetch()

    return { ...props,
        schoolData,
        classPricing,
        monthlyPricing
    }
}, SchoolPriceView)