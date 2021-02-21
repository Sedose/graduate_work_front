/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import constants from '../constants';
import { UserDetailsResponse } from '../types';
import extractData from './util';

const retrieveUserDetails = (
  accessToken: string,
): Promise<UserDetailsResponse> => extractData(fetch(
  `${constants.DEFAULT_BACKEND_CONTEXT_PATH}/api/user-details`, {
    headers: {
      Authentication: accessToken,
    },
  },
));

export default retrieveUserDetails;
