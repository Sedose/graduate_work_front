import React, { useEffect, useState } from 'react';
import {
  Button, Jumbotron, Form, Label, FormGroup,
} from 'reactstrap';
import styled from 'styled-components';
import readXlsxFile from 'read-excel-file';
import Papa from 'papaparse';
import csvToJsonUtil from '../../../application/csvToJsonUtil';
import backendApi from '../../../api/backend-api';

interface Props {
  getAccessToken: Function;
}

interface Courses {
  courses: {
    id: string;
    name: string,
  }[],
}

const FormWrapper = styled.div`
  margin: 12px 0px 0px;
`;

const SelectInput = styled.select`
  margin: 12px;
`;

const FileInputWrapper = styled.div`
  margin: 12px;
`;

const schema = {
  'Полное имя': {
    prop: 'fullName',
    type: String,
    required: true,
  },
  'Действие пользователя': {
    prop: 'userAction',
    type: String,
    required: true,
  },
  'Метка времени': {
    prop: 'timestamp',
    type: String,
    required: true,
  },
};

export default ({ getAccessToken }: Props) => {
  const [selectedFile, setSelectedFile] = useState({
    file: '',
    fileExtension: '',
  });

  const [courseOptions, setCourseOptions] = useState<Courses>();
  const [courseId, setCourseId] = useState('1');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!courseOptions) {
      setCourseOptionsFromBackend();
    }
  });

  useEffect(() => {
    setTimeout(resetStatePartially, 5000);
  }, [success, error]);

  return (
    <>
      {(success || error) && (
        <>
          <div>
            {success && 'Successfully performed operation'}
            {error && 'Error on perform operation'}
          </div>
        </>
      )}
      <div>
        <Jumbotron>
          <div>Register student providing files from Teams</div>
          <FormWrapper>
            <Form>
              {courseOptions
              && (
                <FormGroup>
                  <Label for="course">Select course</Label>
                  <SelectInput name="course" onChange={(event) => setCourseId(event.target.value)}>
                    <option value={-1}>Please, select some option</option>
                    {courseOptions.courses.map(
                      ({ id, name }) => <option key={id} value={id}>{name}</option>,
                    )}
                  </SelectInput>
                </FormGroup>
              )}
              <FormGroup>
                <Label for="fileInput">Select attendance file</Label>
                <FileInputWrapper>
                  <input
                    name="fileInput"
                    type="file"
                    onChange={fileInputChangeHandler}
                    required
                    accept=".xls,.xlsx,.csv"
                  />
                </FileInputWrapper>
              </FormGroup>
              <Button color="primary" onClick={() => handleSubmission()}>Upload student attendance file</Button>
            </Form>
          </FormWrapper>
        </Jumbotron>
      </div>
    </>
  );

  function fileInputChangeHandler(event) {
    const file = event.target.files[0];
    setSelectedFile({ file, fileExtension: file?.name.split('.').pop() ?? '' });
  }

  function handleSubmission() {
    ({
      csv: saveCsv,
      xlsx: saveXlsx,
    }[selectedFile.fileExtension] || (() => setError(true)))();
  }

  function saveCsv() {
    Papa.parse(selectedFile.file, {
      async complete(results) {
        await saveStudentsAttendanceFile(csvToJsonUtil(results.data.slice(1)));
      },
    });
  }

  function saveXlsx() {
    readXlsxFile(selectedFile.file, { schema }).then(async ({ rows }) => {
      await saveStudentsAttendanceFile(rows);
    });
  }

  async function saveStudentsAttendanceFile(rows) {
    const accessToken = await getAccessToken();
    return backendApi.saveStudentsAttendanceFile({
      attendances: rows,
      courseId,
      registeredTimestamp: Date.now(),
    })(accessToken).then((response) => {
      if (response.ok) {
        console.log('Here!');
        setSuccess(true);
      } else {
        setError(true);
      }
    }).catch(() => setError(true));
  }

  async function setCourseOptionsFromBackend() {
    const accessToken = await getAccessToken();
    const courses = await backendApi.fetchCourses(accessToken);
    setCourseOptions(courses);
    setCourseId(courses[0] && courses[0].id);
  }

  function resetStatePartially() {
    setSuccess(false);
    setError(false);
  }
};
