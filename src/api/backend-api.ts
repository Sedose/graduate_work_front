import constants from '../constants';
import { UserDetailsResponse, UserCoordinates, CoursesResponse } from '../types';

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
) => async (accessToken: string) => fetch(`${constants.DEFAULT_BACKEND_API_PATH}/attendance-register-file`, {
  method: 'POST',
  headers: {
    Authorization: accessToken,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(jsonToSend),
});

const fetchCourses = (
  accessToken: string,
): Promise<CoursesResponse> => extractData<CoursesResponse>(fetch(
  `${constants.DEFAULT_BACKEND_API_PATH}/courses`, {
    headers: {
      Authorization: accessToken,
    },
  },
));

export default {
  retrieveUserDetails,
  saveCoordinates,
  extractData,
  saveStudentsAttendanceFile,
  fetchCourses,
};
