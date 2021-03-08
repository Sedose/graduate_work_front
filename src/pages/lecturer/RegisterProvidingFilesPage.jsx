/* eslint-disable react/prop-types */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import {
  Button, ButtonGroup, Form, Jumbotron,
} from 'reactstrap';
import styled from 'styled-components';
import readXlsxFile from 'read-excel-file';
import Papa from 'papaparse';
import constants from '../../constants';
import csvToJsonUtil from '../../application/csvToJsonUtil';
import backendApi from '../../api/backend-api';
import { CoursesResponse } from '../../types';

const FormWrapper = styled.div`
  margin: 12px 0px 0px;
`;

const SelectInput = styled.select`
`;

export default ({ getAccessToken }) => {
  const [selectedFile, setSelectedFile] = useState({
    file: '',
    fileExtension: '',
  });

  const [courseOptions, setCourseOptions] = useState();
  const [courseId, setCourseId] = useState();

  const setCourseOptionsFromBackend = async () => {
    const accessToken = await getAccessToken();
    const courses = await backendApi.fetchCourses(accessToken);
    setCourseOptions(courses.courses);
    setCourseId(courses[0] && courses[0].id);
  };

  useEffect(() => {
    if (!courseOptions) {
      setCourseOptionsFromBackend();
    }
  });

  const changeHandler = (event) => {
    const file = event.target.files[0];
    setSelectedFile({ file, fileExtension: file.name.split('.').pop() });
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
    const accessToken = await getAccessToken();
    if (selectedFile.fileExtension === 'csv') {
      Papa.parse(selectedFile.file, {
        async complete(results) {
          const sliced = results.data.slice(1);
          backendApi.saveStudentsAttendanceFile(
            { attendances: csvToJsonUtil(sliced) },
          )(accessToken);
        },
      });
    } else if (selectedFile.fileExtension === 'xlsx') {
      readXlsxFile(selectedFile.file, { schema }).then(async ({ rows, errors }) => {
        backendApi.saveStudentsAttendanceFile({
          attendances: rows,
        })(accessToken);
      });
    } else {
      console.log('toast error fucking!!!');
    }
  };

  return (
    <div>
      <Jumbotron>
        <div>Register student providing files from Teams</div>
        <FormWrapper>
          {courseOptions
          && (
          <SelectInput onChange={(event) => setCourseId(event.target.value)}>
            {courseOptions.map((it) => <option key={it.id} value={it.id}>{it.name}</option>)}
          </SelectInput>
          )}
          <input type="file" onChange={changeHandler} required />
          <Button color="primary" onClick={() => handleSubmission()}>Upload student attendance file</Button>
        </FormWrapper>
      </Jumbotron>
    </div>
  );
};
