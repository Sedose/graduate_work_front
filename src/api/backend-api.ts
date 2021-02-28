/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import constants from '../constants';
import { UserDetailsResponse } from '../types';
import extractData from './util';

const retrieveUserDetails = (
  accessToken: string,
): Promise<UserDetailsResponse> => extractData<UserDetailsResponse>(fetch(
  `${constants.DEFAULT_BACKEND_API_PATH}/user-details`, {
    headers: {
      Authorization: accessToken,
    },
  },
));

export default retrieveUserDetails;
