const checkResponse = (response: Response): Response => {
  if (!response.ok) {
    console.error(`${response.status.toString()}: ${response.statusText}`);
    throw response;
  }
  return response;
};

interface FetchRatesProps {
  startDate: string;
  endDate: string;
}

/**
 * "/fluctuation" endpoint is used because it provides current and past rates in one API request.
 * Current rates is used for conversion. Past rates is used for change calculations.
 *
 * Furthermore, rates for ALL currencies are fetched, this increases the client's memory overhead
 * but allow for fewer API requests.
 *
 * Number of requests must be limited since free account's API key only allows 250 requests/month🤨
 */
export const fetchFluctuation = ({ startDate, endDate }: FetchRatesProps): Promise<Response> => {
  return fetch(
    `${process.env.REACT_APP_API_HOST}/fluctuation?start_date=${startDate}&end_date=${endDate}`,
    {
      method: 'GET',
      headers: {
        apikey: process.env.REACT_APP_API_KEY || '',
      },
    },
  ).then((res) => checkResponse(res));
};

/**
 * Get available currency symbols
 */
export const fetchSymbols = (): Promise<Response> => {
  return fetch(`${process.env.REACT_APP_API_HOST}/symbols`, {
    method: 'GET',
    headers: {
      apikey: process.env.REACT_APP_API_KEY || '',
    },
  }).then((res) => checkResponse(res));
};
