/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React from 'react';
import styled from 'styled-components';

const CopyrightWrapper = styled.div`
  'align-self': 'center',
`;

export default () => (
  <CopyrightWrapper>
    {`Copyright © Online log of visits ${new Date().getFullYear()}`}
  </CopyrightWrapper>
);
