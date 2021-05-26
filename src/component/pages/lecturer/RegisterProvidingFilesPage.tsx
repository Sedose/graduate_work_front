import React, { useEffect, useState } from 'react';
import {
  Button, Jumbotron, Form, Label, FormGroup,
} from 'reactstrap';
import readXlsxFile from 'read-excel-file';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import csvToJsonUtil from '../../../application/csvToJsonUtil';
import backendApi from '../../../api/backend-api';
import { FileInputWrapper, FormWrapper, SelectInput } from '../../../styles/styles';
import schema from './schema';
import 'react-toastify/dist/ReactToastify.css';

const saveAttendancesResponseBodyToMessageMap = {
  'access.token.invalid': 'Cannot authorize!',
  'cannot.extract.parts.from.user.full.name': 'Invalid file!',
  'cannot.get.user.by.full.name': 'Cannot find user with such first name, middle name, last name!',
  'to.frequent.file.uploads': 'To many file uploads from you! Try again later!',
};

export default ({ getAccessToken }: Props) => {
  const [selectedFile, setSelectedFile] = useState({
    file: '',
    fileExtension: '',
  });

  const [courseOptions, setCourseOptions] = useState<Courses>();
  const [courseId, setCourseId] = useState('1');

  useEffect(() => {
    setCourseOptionsFromBackend();
  }, []);

  return (
    <>
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
                    (event) => setCourseId(event.target.value)
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
    if (isFormInvalid()) {
      toast.error('Error on perform operation. Invalid form input. File, course should be selected!');
    } else {
      ({
        csv: saveCsv,
        xlsx: saveXlsx,
      }[selectedFile.fileExtension] || (() => toast.error('Error on perform operation. Invalid selected file extension!')))();
    }
  }

  function saveCsv() {
    Papa.parse(selectedFile.file, {
      async complete(results) {
        await saveStudentsAttendancesFile(csvToJsonUtil(results.data.slice(1)));
      },
    });
  }

  function saveXlsx() {
    readXlsxFile(selectedFile.file, { schema }).then(async ({ rows }) => {
      await saveStudentsAttendancesFile(rows);
    });
  }

  async function saveStudentsAttendancesFile(rows) {
    const accessToken = await getAccessToken();
    const response = await backendApi.saveStudentsAttendanceFile({
      attendances: rows,
      courseId,
      registeredTimestamp: Date.now(),
    })(accessToken);
    if (!response.ok) {
      const responseBody = await response.json();
      const errorMessage = saveAttendancesResponseBodyToMessageMap[responseBody.errorCode] || '';
      toast.error(`Server side error! ${errorMessage}`);
    }
  }

  async function setCourseOptionsFromBackend() {
    const accessToken = await getAccessToken();
    const courses = await backendApi.fetchCourses(accessToken);
    setCourseOptions(courses);
    setCourseId(courses[0] && courses[0].id);
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
