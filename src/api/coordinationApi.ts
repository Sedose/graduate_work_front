/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import constants from '../constants';
import { UserCoordinates } from '../types';

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

export default saveCoordinates;
