import React, { useEffect, useState } from 'react';
import {
  Button, Jumbotron, Toast, ToastHeader, ToastBody, Form, Label, FormGroup,
} from 'reactstrap';
import styled from 'styled-components';
import readXlsxFile from 'read-excel-file';
import Papa from 'papaparse';
import csvToJsonUtil from '../../../application/csvToJsonUtil';
import backendApi from '../../../api/backend-api';

const FormWrapper = styled.div`
  margin: 12px 0px 0px;
`;

const SelectInput = styled.select`
  margin: 12px;
`;

const FileInputWrapper = styled.div`
  margin: 12px;
`;

interface Props {
  getAccessToken: Function;
}

export default ({ getAccessToken }: Props) => {
  const [selectedFile, setSelectedFile] = useState({
    file: '',
    fileExtension: '',
  });

  const [courseOptions, setCourseOptions] = useState<Courses>();
  const [courseId, setCourseId] = useState('1');
  const [errorOnSavingFile, setErrorOnSavingFile] = useState(false);
  const [successOnSavingFile, setSuccessOnSavingFile] = useState(false);

  const setCourseOptionsFromBackend = async () => {
    const accessToken = await getAccessToken();
    const courses = await backendApi.fetchCourses(accessToken);
    setCourseOptions(courses);
    setCourseId(courses[0] && courses[0].id);
  };

  useEffect(() => {
    if (!courseOptions) {
      setCourseOptionsFromBackend();
    }
    setTimeout(() => {
      setErrorOnSavingFile(false);
      setSuccessOnSavingFile(false);
    }, 6000);
  });

  const changeHandler = (event) => {
    const file = event.target.files[0];
    setSelectedFile({ file, fileExtension: file?.name.split('.').pop() ?? '' });
  };

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

  const handleSubmission = async () => {
    if (selectedFile.fileExtension === 'csv') {
      Papa.parse(selectedFile.file, {
        async complete(results) {
          saveStudentsAttendanceFile(csvToJsonUtil(results.data.slice(1)));
        },
      });
    } else if (selectedFile.fileExtension === 'xlsx') {
      readXlsxFile(selectedFile.file, { schema }).then(async ({ rows }) => {
        saveStudentsAttendanceFile(rows);
      });
    }
  };

  async function saveStudentsAttendanceFile(rows) {
    const accessToken = await getAccessToken();
    return backendApi.saveStudentsAttendanceFile({
      attendances: rows,
      courseId,
      registeredTimestamp: Date.now(),
    })(accessToken).then((response) => {
      if (response.ok) {
        setSuccessOnSavingFile(true);
        setErrorOnSavingFile(false);
      } else {
        setErrorOnSavingFile(true);
      }
    }).catch(() => setErrorOnSavingFile(true));
  }

  return (
    <div>
      {(errorOnSavingFile || successOnSavingFile)
          && (
          <div className={`p-3 my-2 rounded ${(errorOnSavingFile && 'bg-danger') || (successOnSavingFile && 'bg-success')}`}>
            <Toast>
              <ToastHeader>
                {errorOnSavingFile && 'Error'}
                {successOnSavingFile && 'Ok'}
              </ToastHeader>
              <ToastBody>
                {errorOnSavingFile && `Error on saving student attendance.
                Try to amend file and try again. Maybe, there is no such student!`}
                {successOnSavingFile && 'Successfully completed operation!'}
              </ToastBody>
            </Toast>
          </div>
          )}
      <Jumbotron>
        <div>Register student providing files from Teams</div>
        <FormWrapper>
          <Form>
            {courseOptions
          && (
            <FormGroup>
              <Label for="course">Select course</Label>
              <SelectInput name="course" onChange={(event) => setCourseId(event.target.value)}>
                <option value={1}>Please, select some option</option>
                {courseOptions.courses.map(
                  ({ id, name }) => <option key={id} value={id}>{name}</option>,
                )}
              </SelectInput>
            </FormGroup>
          )}
            <FormGroup>
              <Label for="fileInput">Select attendance file</Label>
              <FileInputWrapper>
                <input name="fileInput" type="file" onChange={changeHandler} required accept=".xls,.xlsx,.csv" />
              </FileInputWrapper>
            </FormGroup>
            <Button color="primary" onClick={() => handleSubmission()}>Upload student attendance file</Button>
          </Form>
        </FormWrapper>
      </Jumbotron>
    </div>
  );
};

interface Courses {
  courses: {
    id: string;
    name: string,
  }[],
}
