/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { Button, ButtonGroup, Jumbotron } from 'reactstrap';
import styled from 'styled-components';
import constants from '../../constants';

const ButtonGroupWrapper = styled.div`
  margin: 12px 0px 0px;
`;

const RegisterProvidingFilesPage = ({ getAccessToken }: any) => {
  const [selectedFile, setSelectedFile] = useState<Blob>();

  const changeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async () => {
    const formData = new FormData();

    formData.append('file', selectedFile ?? '');

    fetch(`${constants.DEFAULT_BACKEND_API_PATH}/attendance-register-file`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: await getAccessToken(),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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

export default RegisterProvidingFilesPage;
