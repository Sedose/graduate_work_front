/* eslint-disable react/prop-types */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { Button, ButtonGroup, Jumbotron } from 'reactstrap';
import styled from 'styled-components';
import readXlsxFile from 'read-excel-file';
import Papa from 'papaparse';
import constants from '../../constants';
import csvToJsonUtil from '../../application/csvToJsonUtil';
import backendApi from '../../api/backend-api';

const ButtonGroupWrapper = styled.div`
  margin: 12px 0px 0px;
`;

// interface CsvRow {
//   fullName: string,
//   userAction: string,
//   timestamp: Date,
// }

export default ({ getAccessToken }) => {
  const [selectedFile, setSelectedFile] = useState({ file: undefined, fileExtension: undefined });

  const changeHandler = (event) => {
    const file = event.target.files[0];
    setSelectedFile({ file, fileExtension: file.name.split('.').pop() });
    console.log({ file, fileExtension: file.name.split('.').pop() });
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
        complete(results) {
          const sliced = results.data.slice(1);
          backendApi.saveStudentsAttendanceFile(csvToJsonUtil(sliced))(accessToken);
          console.log('csvToJsonUtil: ', csvToJsonUtil(sliced));
        },
      });
    } else if (selectedFile.fileExtension === 'xlsx') {
      readXlsxFile(selectedFile.file, { schema }).then(({ rows, errors }) => {
        console.log('rows: ', rows);
        backendApi.saveStudentsAttendanceFile(rows)(accessToken);
      });
    } else {
      console.log('toast error fucking!!!');
    }
  };

  return (
    <div>
      <Jumbotron>
        <div>Register student providing files from Teams</div>
        <ButtonGroupWrapper>
          <ButtonGroup>
            <input type="file" onChange={changeHandler} required />
            <Button color="primary" onClick={() => handleSubmission()}>Upload student attendance file</Button>
          </ButtonGroup>
        </ButtonGroupWrapper>
      </Jumbotron>
    </div>
  );
};
