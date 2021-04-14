import React, { useEffect, useState } from 'react';
import {
  Button, Jumbotron, Form, Label, FormGroup,
} from 'reactstrap';
import readXlsxFile from 'read-excel-file';
import Papa from 'papaparse';
import csvToJsonUtil from '../../../application/csvToJsonUtil';
import backendApi from '../../../api/backend-api';
import { FileInputWrapper, FormWrapper, SelectInput } from '../../../styles/styles';
import schema from './schema';

export default ({ getAccessToken }: Props) => {
  const [selectedFile, setSelectedFile] = useState({
    file: '',
    fileExtension: '',
  });

  const [courseOptions, setCourseOptions] = useState<Courses>();
  const [courseId, setCourseId] = useState('1');
  const [success, setSuccess] = useState(false);
  const [frontendError, setFrontendError] = useState(false);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    if (!courseOptions) {
      setCourseOptionsFromBackend();
    }
  });

  useEffect(() => {
    setTimeout(resetStatePartially, 5000);
  }, [success, frontendError, backendError]);

  return (
    <>
      {(success || frontendError || backendError) && (
        <div className={`alert ${(frontendError || backendError) && 'alert-danger'} ${success && 'alert-success'}`} role="alert">
          {success && 'Successfully performed operation'}
          {frontendError && 'Error on perform operation. Invalid form input'}
          {backendError && 'Error on perform operation. Server side error.'}
        </div>
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
                  <SelectInput
                    name="course"
                    onChange={
                    (event) => {
                      setCourseId(event.target.value);
                      setTimeout(() => console.log('course: ', courseId), 0);
                    }
                  }
                  >
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
    console.log('courseId: ', courseId);
    if (isFormInvalid()) {
      console.log('form invalid');
      setFrontendError(true);
    } else {
      console.log('form valid');
      ({
        csv: saveCsv,
        xlsx: saveXlsx,
      }[selectedFile.fileExtension] || (() => setFrontendError(true)))();
    }
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
    })(accessToken).then((resp) => {
      if (!resp.ok) {
        setSuccess(false);
        setBackendError(true);
        throw new Error(resp.statusText);
      }
      setSuccess(true);
      return resp.json();
    }).catch(() => {
      setBackendError(true);
    });
  }

  async function setCourseOptionsFromBackend() {
    const accessToken = await getAccessToken();
    const courses = await backendApi.fetchCourses(accessToken);
    setCourseOptions(courses);
    setCourseId(courses[0] && courses[0].id);
  }

  function resetStatePartially() {
    setSuccess(false);
    setBackendError(false);
    setFrontendError(false);
  }

  function isFormInvalid() {
    return isInvalidCourseId()
      || isFileUnselected();
  }

  function isInvalidCourseId() {
    return [
      undefined,
      null,
      '-1',
    ].includes(courseId);
  }

  function isFileUnselected() {
    console.log('selectedFile: ', selectedFile);
    return selectedFile == null
      || selectedFile.fileExtension === ''
      || selectedFile.file === '';
  }
};

interface Props {
  getAccessToken: Function;
}

interface Courses {
  courses: {
    id: string;
    name: string,
  }[],
}
