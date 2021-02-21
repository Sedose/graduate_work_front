const extractData = <T>(promise: Promise<Response>): Promise<T> => promise.then((response) => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json() as Promise<{ data: T }>;
}).then((data) => data.data);

export default extractData;
