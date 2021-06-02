import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Jumbotron,
  Label,
} from 'reactstrap';
import { toast } from 'react-toastify';
import ReactToPdf from 'react-to-pdf';
import styled from 'styled-components';
import moment from 'moment';
import backendApi from '../../../api/backend-api';
import { SelectInput } from '../../../styles/styles';
import { isInteger } from '../../../util';

const ref = React.createRef();

const options = {
  orientation: 'portrait',
  unit: 'in',
  format: 'letter',
};

const Table = styled.table`
  border: 1px solid black;
`;

const Th = styled.th`
  border: 1px solid black;
`;

const Td = styled.th`
  border: 1px solid black;
`;

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
    setStudentGroups(groups);
  }

  async function setCoursesFromBackend() {
    const accessToken = await getAccessToken();
    const coursesFromBackend = await backendApi.fetchCourses(accessToken);
    setCourses(coursesFromBackend);
  }

  const handleGetReport = async () => {
    if (isFormInvalid()) {
      toast.error('Invalid options chosen');
    } else {
      const reportByStudentGroupAndCourse = await backendApi.fetchReport({
        studentGroupId,
        courseId,
      })(await getAccessToken());
      console.log('reportByStudentGroupAndCourse: ', reportByStudentGroupAndCourse);
      setReport(reportByStudentGroupAndCourse);
    }
  };

  const isFormInvalid = () => {
    const studentGroupIdAsNumber = parseInt(studentGroupId, 10);
    const courseIdAsNumber = parseInt(courseId, 10);
    return (
      !(
        isInteger(studentGroupIdAsNumber) && isInteger(courseIdAsNumber)
        && studentGroupId > 0 && courseId > 0
      )
    ); 
  };

  const selectedStudentGroupName = studentGroups?.find(({ id }) => id == studentGroupId)?.name;
  const selectedCourseName = courses?.find(({ id }) => id == courseId)?.name;

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
                  {studentGroups?.map(
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
                  {courses?.map(
                    ({ id, name }) => <option key={id} value={id}>{name}</option>,
                  )}
                </SelectInput>
              </FormGroup>
              )}
        <Button onClick={handleGetReport}>Get report</Button>
      </Form>
      <br />
      {report?.items.length > 0 && (
      <div ref={ref}>
        <div>Report on student attendance</div> 
        <div>by group {selectedStudentGroupName}</div>
        <div>and course {selectedCourseName}</div>
        <div>Registered by: {report?.lecturerRegisteredBy.firstName}
          {report?.lecturerRegisteredBy.middleName}
          {` ${report?.lecturerRegisteredBy.lastName}`}
        </div>
        <div>Registered at UTC time: {moment.utc().format()}</div>
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Email</Th>
              <Th>First name</Th>
              <Th>Middle name</Th>
              <Th>Last name</Th>
              <Th>Attendances percent</Th>
            </tr>
          </thead>
          <tbody>
            { report?.items.map(
              ({
                email, firstName, middleName, lastName, attendancesPercent,
              }, index) => (
                <tr key={email}>
                  <Th scope="row">{index + 1}</Th>
                  <Td>{email}</Td>
                  <Td>{firstName}</Td>
                  <Td>{middleName}</Td>
                  <Td>{lastName}</Td>
                  <Td>{`${attendancesPercent} %`}</Td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
        
      </div>
      )}

      {!report?.items.length > 0 && (
      <Alert color="warning">Found no records for such parameters</Alert>
      )}
    
      <br />
      <Form>
        {report?.items.length > 0 && (
          <ReactToPdf
            targetRef={ref} 
            filename="student_attendances_report.pdf"
            option={options}
          >
            {({ toPdf }) => (
              <Button onClick={toPdf}>Generate PDF</Button>
            )}
          </ReactToPdf>
        )}
      </Form>
    </div>
  ); 
};
