/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Button, ButtonGroup, Jumbotron } from 'reactstrap';
import styled from 'styled-components';

const ButtonGroupWrapper = styled.div`
  margin: 12px 0px 0px;
`;

export default () => {
  const [choiceRegisterProvidingFiles, setChoiceRegisterProvidingFiles] = useState(false);

  return (
    <>
      {choiceRegisterProvidingFiles && <Redirect to="/register/providing-files" />}
      <div>
        <Jumbotron>
          <div>Lecturer side</div>
          <ButtonGroupWrapper>
            <ButtonGroup>
              <Button color="primary" onClick={() => setChoiceRegisterProvidingFiles(true)}>Register providing files</Button>
            </ButtonGroup>
          </ButtonGroupWrapper>
        </Jumbotron>
      </div>
    </>
  );
};
