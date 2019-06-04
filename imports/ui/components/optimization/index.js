import React, { Fragment } from 'react';
import { Loading } from '/imports/ui/loading';
import styled from 'styled-components';
import EditButton from '/imports/ui/components/landing/components/buttons/EditButton';
import { compressImage, withPopUp } from '/imports/util';
import RecordRender from './RecordRender';

const Head = styled.div`
  margin: 5px;
  font-size: larger;
  display: inline-block;
  border: 3px solid #4caf50;
  border-radius: 15px;
  font-weight: 400;
  padding: 4px;
  background-color: aliceblue;
`;
const Center = styled.div`
  text-align: center;
`;
const Wrapper = styled.div`
  margin: 5px;
  font-size: larger;
  font-weight: 400;
`;

class Optimization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true,
      classTypeRecords: null,
      classTypeData: '',
      classTypeStatus: [],
      classTypeButtonText: 'Optimization Required',
      schoolRecords: null,
      schoolData: '',
      schoolStatus: [],
      schoolText: 'Optimization Required',
      msg1: null,
      msg2: null,
      b1Text: 'Check',
    };
  }

  Notes = () => (
    <Head>
      <u> Caution Notes</u>
:-
      <br />
      1.Press button only one time recommend Like Check and Optimization required.
      <br />
      2.Process gonna take time according to results.
      <br />
      3.Opening images links in new tab recommend.
      <br />
      4.Use one optimization in one time for easy handling.
    </Head>
  );

  recordsFinder = () => {
    this.setState({ status: false, b1Text: 'Checking' });
    Meteor.call('classType.optimizationFinder', (err, res) => {
      if (!_.isEmpty(res)) {
        const records = res.length;
        this.setState({
          classTypeRecords: records,
          classTypeData: res,
          msg1: `${records} Class images need optimization.`,
          classTypeStatus: [],
        });
      }
    });
    Meteor.call('school.optimizationFinder', (err, res) => {
      if (!_.isEmpty(res)) {
        const records = res.length;
        this.setState({
          schoolRecords: records,
          status: true,
          msg2: `${records} School images need optimization.`,
          schoolData: res,
          schoolStatus: [],
          b1Text: 'Check',
        });
      }
    });
  };

  optimize = async (where) => {
    const { popUp } = this.props;
    const {
      classTypeData,
      classTypeStatus,
      schoolData,
      schoolStatus,
      classTypeRecords,
      schoolRecords,
    } = this.state;
    if (where) {
      const allUploadPromise = [];
      let url;
      const doc = [];
      let name;
      if (where == 'classType') {
        this.setState({ classTypeButtonText: 'Optimization Starting' });
        const parentMap = classTypeData.map(async (current, index) => {
          // if(index<15) {
          if (current.classTypeImg) {
            try {
              doc.push({ _id: current._id, schoolId: doc.schoolId });
              url = current.classTypeImg;
              name = `${current.name} ${
                current.filters && current.filters.schoolName
                  ? ` of School  ${current.filters.schoolName} `
                  : ''
              }`;
              classTypeStatus.push({ name, status: 'pending', url });
              this.setState({ classTypeStatus });
              classTypeStatus[index].status = 'Image Compression Started';
              this.setState({ classTypeStatus });
              const result = await compressImage(null, url, true);
              console.group('class type image Optimization');
              if (_.isArray(result)) {
                console.log('Non-cors');
                classTypeStatus[index].status = 'Image Compressed';
                this.setState({ classTypeStatus });
                for (let i = 0; i <= 1; i++) {
                  allUploadPromise.push(
                    new Promise((resolve, reject) => {
                      classTypeStatus[index].status = 'Uploading';
                      this.setState({ classTypeStatus });
                      S3.upload({ files: { 0: result[i] }, path: 'compressed' }, (err, res) => {
                        if (res) {
                          if (i == 0) {
                            doc[index].medium = res.secure_url;
                            classTypeStatus[index].status = 'Medium Version Uploaded';
                            this.setState({ classTypeStatus });
                          } else {
                            doc[index].low = res.secure_url;
                            classTypeStatus[index].status = 'Low Version Uploaded';
                            this.setState({ classTypeStatus });
                          }
                          resolve(true);
                        } else {
                          reject();
                        }
                      });
                    }),
                  );
                }
                Promise.all(allUploadPromise).then(async () => {
                  await new Promise((resolve, reject) => {
                    classTypeStatus[index].status = 'Success';
                    Meteor.call(
                      'classType.editClassType',
                      { doc_id: doc[index]._id, doc: doc[index] },
                      (err, res) => {
                        if (res) this.setState({ classTypeStatus });
                        resolve();
                        if (index + 1 == classTypeRecords) {
                          this.setState({ classTypeButtonText: 'Optimization Finished' });
                          popUp.appear('success', {
                            title: 'Message',
                            content: 'Optimization Finished',
                          });
                        }
                      },
                    );
                  });
                });
              } else {
                console.log('cors');
                classTypeStatus[index].status = 'URL Expired';
                this.setState({ classTypeStatus });
                if (index + 1 == classTypeRecords) {
                  this.setState({ classTypeButtonText: 'Optimization Finished' });
                  popUp.appear('success', { title: 'Message', content: 'Optimization Finished' });
                }
              }
              console.groupEnd('class type image Optimization');
            } catch (error) {
              console.log('TCL: Optimization -> }catch -> error', error);
            }
          }

          // }
        });
        await Promise.all(parentMap);
        console.log('finished');
      } else {
        this.setState({ schoolText: 'Optimization Starting' });
        const parentMap = schoolData.map(async (current, index) => {
          // if(index<20){
          if (current.mainImage) {
            try {
              url = current.mainImage;
              doc.push({ _id: current._id });
              name = current.name;
              schoolStatus.push({ name, status: 'pending', url });
              this.setState({ schoolStatus });
              schoolStatus[index].status = 'Image Compression Started';
              this.setState({ schoolStatus });
              const result = await compressImage(null, url, true);
              console.group('School Image Optimization');
              if (_.isArray(result)) {
                console.log('Non-cors');
                schoolStatus[index].status = 'Image Compressed';
                this.setState({ schoolStatus });
                for (let i = 0; i <= 1; i++) {
                  allUploadPromise.push(
                    new Promise((resolve, reject) => {
                      schoolStatus[index].status = 'Uploading';
                      this.setState({ schoolStatus });
                      S3.upload({ files: { 0: result[i] }, path: 'compressed' }, (err, res) => {
                        if (res) {
                          if (i == 0) {
                            doc[index].mainImageMedium = res.secure_url;
                            schoolStatus[index].status = 'Medium Version Uploaded';
                            this.setState({ schoolStatus });
                          } else {
                            doc[index].mainImageLow = res.secure_url;
                            schoolStatus[index].status = 'Low Version Uploaded';
                            this.setState({ schoolStatus });
                          }
                          resolve(true);
                        } else {
                          reject();
                        }
                      });
                    }),
                  );
                }
                Promise.all(allUploadPromise).then(async () => {
                  await new Promise((resolve, reject) => {
                    console.log('doc', index);
                    schoolStatus[index].status = 'Success';
                    Meteor.call('editSchool', doc[index]._id, doc[index], (err, res) => {
                      this.setState({ schoolStatus });
                      resolve();
                      if (index + 1 == schoolRecords) {
                        this.setState({ schoolText: 'Optimization Finished' });
                        popUp.appear('success', {
                          title: 'Message',
                          content: 'Optimization Finished',
                        });
                      }
                    });
                  });
                });
              } else {
                console.log('cors');
                schoolStatus[index].status = 'URL Expired';
                this.setState({ schoolStatus });
                if (index + 1 == schoolRecords) {
                  popUp.appear('success', { title: 'Message', content: 'Optimization Finished' });

                  this.setState({ schoolText: 'Optimization Finished' });
                }
              }
              console.groupEnd('School Image Optimization');
            } catch (error) {
              console.log('TCL: }catch -> error', error);
            }

            // }
          }
        });
        await Promise.all(parentMap);
        console.log('finished');
      }
    }
  };

  render() {
    const {
      status,
      b1Text,
      msg1,
      msg2,
      classTypeRecords,
      schoolStatus,
      classTypeStatus,
      classTypeButtonText,
      schoolData,
      schoolText,
      schoolRecords,
    } = this.state;
    return (
      <Fragment>
        <Center>
          <Wrapper>
            {this.Notes()}
            <br />
            <Head>
              Click Check for finding optimization in the system.
              <EditButton label={b1Text} onClick={this.recordsFinder} />
            </Head>
            <br />
            <Head>
              {msg1 && msg1}
              {classTypeRecords && (
                <EditButton
                  label={classTypeButtonText}
                  onClick={() => {
                    this.optimize('classType');
                  }}
                />
              )}
            </Head>
            <br />
            <Head>
              {msg2 && msg2}
              {schoolRecords && (
                <EditButton
                  label={schoolText}
                  onClick={() => {
                    this.optimize('school');
                  }}
                />
              )}
            </Head>
            <br />

            {!status && <Loading />}
            {!_.isEmpty(classTypeStatus) && (
              <RecordRender data={classTypeStatus} name="Class Type Name" />
            )}
            {!_.isEmpty(schoolStatus) && <RecordRender data={schoolStatus} name="School Name" />}
          </Wrapper>
        </Center>
      </Fragment>
    );
  }
}
export default withPopUp(Optimization);
