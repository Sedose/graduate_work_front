/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import constants from '../constants';
import { UserDetailsResponse, UserCoordinates } from '../types';

const extractData = <T>(promise: Promise<Response>): Promise<T> => promise.then((response) => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json() as Promise<T>;
});

const retrieveUserDetails = (
  accessToken: string,
): Promise<UserDetailsResponse> => extractData<UserDetailsResponse>(fetch(
  `${constants.DEFAULT_BACKEND_API_PATH}/user-details`, {
    headers: {
      Authorization: accessToken,
    },
  },
));

const saveCoordinates = (
  coordinates : UserCoordinates,
) => async (accessToken: string) => fetch(`${constants.DEFAULT_BACKEND_API_PATH}/v1/coordinates`, {
  method: 'PUT',
  headers: {
    Authorization: accessToken,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(coordinates),
});

const saveStudentsAttendanceFile = (
  jsonToSend : any,
) => async (accessToken: string) => {
  console.log('api: ', jsonToSend);
  return fetch(`${constants.DEFAULT_BACKEND_API_PATH}/attendance-register-file`, {
    method: 'POST',
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonToSend),
  });
};

export default {
  retrieveUserDetails,
  saveCoordinates,
  extractData,
  saveStudentsAttendanceFile,
};
