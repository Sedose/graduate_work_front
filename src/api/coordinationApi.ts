export const saveCoordinates = (
  coordinates : UserCoordinates
) => async (accessToken: string) => fetch('/api/v1/coordinates', {
  method: 'PUT',
  headers: {
    'Authorization': accessToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(coordinates)
});
