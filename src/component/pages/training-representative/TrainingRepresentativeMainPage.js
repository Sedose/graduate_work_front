import React, { useEffect, useState } from 'react';
import {
  Form, FormGroup, Jumbotron, Label,
} from 'reactstrap';
import backendApi from '../../../api/backend-api';
import { SelectInput } from '../../../styles/styles';

export default ({ getAccessToken }) => {
  const [studentGroups, setStudentGroups] = useState();
  const [selectedStudentGroup, setSelectedStudentGroup] = useState();
  
  useEffect(() => {
    setStudentGroupsFromBackend();
  }, []);

  async function setStudentGroupsFromBackend() {
    const accessToken = await getAccessToken();
    const groups = backendApi.fetchStudentGroups(accessToken);
    setStudentGroups(groups);
  }
  
  return (
    <div>
      <Jumbotron paragraph>
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
                              (event) => setSelectedStudentGroup(event.target.value)
                          }
                >
                  <option value={-1}>Please, select some option</option>
                  {studentGroups.map(
                    ({ id, name }) => <option key={id} value={id}>{name}</option>,
                  )}
                </SelectInput>
              </FormGroup>
              )}
      </Form>
      Selected group: {selectedStudentGroup}
    </div>
  ); 
};
