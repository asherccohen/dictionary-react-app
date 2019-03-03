/* import { httpRequest } from '../utils/apiClient';
import { AWS_DICTIONARIES } from '../constants/Urls';
import { generateString } from '../utils/helpers/filteringHelper';

// eslint-disable-next-line
export function getDictionaries(numberOfItems, fromID) {
  // The fetch events API endpoint allows clients to limit the number
  // of events returned. Additionally, one could also specify an event
  // ID to ask the event service to send the requested number of events
  // starting FROM the given ID.
  const fetchLimitQuery = `limit=${numberOfItems || 10}`;
  const fromIDQuery = fromID ? `&fieldOffset=${fromID}` : '';
  const queryString = fetchLimitQuery + fromIDQuery;
  return new Promise((resolve, reject) => {
    httpRequest(
      AWS_DICTIONARIES,
      `/v1?${queryString}`,
      'get',
      { 'Content-Type': 'application/json' },
      null
    )
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}
 */
