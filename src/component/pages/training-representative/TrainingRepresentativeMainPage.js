import React, { useEffect, useState } from 'react';
import {
  Button,
  Form, FormGroup, Jumbotron, Label, Table,
} from 'reactstrap';
import backendApi from '../../../api/backend-api';
import { SelectInput } from '../../../styles/styles';

export default ({ getAccessToken }) => {
  const [studentGroups, setStudentGroups] = useState();
  const [studentGroupId, setStudentGroupId] = useState();
  const [courseId, setCourseId] = useState();
  const [courses, setCourses] = useState();
  const [report, setReport] = useState();

  useEffect(() => {
    setStudentGroupsFromBackend();
    setCoursesFromBackend();
  }, []);

  async function setStudentGroupsFromBackend() {
    const accessToken = await getAccessToken();
    const groups = await backendApi.fetchStudentGroups(accessToken);
    console.log(groups);
    setStudentGroups(groups);
  }

  async function setCoursesFromBackend() {
    const accessToken = await getAccessToken();
    const coursesFromBackend = await backendApi.fetchCourses(accessToken);
    setCourses(coursesFromBackend);
  }

  const handleGetReport = async () => {
    console.log(studentGroupId);
    const reportByStudentGroupAndCourse = await backendApi.fetchReportByStudentGroupIdAndCourseId({
      studentGroupId,
      courseId,
    })(await getAccessToken());
    setReport(reportByStudentGroupAndCourse);
  };
  
  return (
    <div>
      <Jumbotron>
        Training representative main page
      </Jumbotron>
      Please, select group
      <Form>
        {studentGroups
              && (
              <FormGroup>
                <Label for="studentGroup">Select student group</Label>
                <SelectInput
                  name="studentGroup"
                  onChange={
                              (event) => setStudentGroupId(event.target.value)
                          }
                >
                  <option value={-1}>Please, select some option</option>
                  {studentGroups && studentGroups.map(
                    ({ id, name }) => <option key={id} value={id}>{name}</option>, 
                  )} 
                </SelectInput>
                <Label for="course">Select course</Label>
                <SelectInput
                  name="course"
                  onChange={
                          (event) => setCourseId(event.target.value)
                      }
                >
                  <option value={-1}>Please, select some option</option>
                  {courses && courses.courses.map(
                    ({ id, name }) => <option key={id} value={id}>{name}</option>,
                  )}
                </SelectInput>
              </FormGroup>
              )}
        <Button onClick={handleGetReport}>Get report</Button>
      </Form>
      <br />
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>First name</th>
            <th>Middle name</th>
            <th>Last name</th>
            <th>Attendances percent</th>
          </tr>
        </thead>
        <tbody>
          { report && report.reportItems.map(
            ({
              email, firstName, middleName, lastName, attendancesPercent,
            }, index) => (
              <tr key={email}>
                <th scope="row">{index + 1}</th>
                <td>{email}</td>
                <td>{firstName}</td>
                <td>{middleName}</td>
                <td>{lastName}</td>
                <td>{`${attendancesPercent} %`}</td>
              </tr>
            ),
          )}
        </tbody>
      </Table>
    </div>
  ); 
};
