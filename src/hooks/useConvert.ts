import { useCallback, useEffect, useState } from 'react';
import * as client from '@client';
import { formatDate } from '@utils';

interface Rates {
  [currency: string]: {
    start_rate: number;
    end_rate: number;
    change: number;
    change_pct: number;
  };
}

interface ConvertParams {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

interface Context {
  paramsUsed: ConvertParams;
  convertedAmount: number;
  changePercent: number;
  convert: (params: ConvertParams) => void;
}

export const useConvert = (): Context => {
  const [rates, setRates] = useState<Rates>({});
  const [lastFetchTime, setLastFetchTime] = useState<Date | undefined>(undefined);

  // Stores and returns the values used for conversion so the UI doesn't update
  // when new values are entered.
  const [paramsUsed, setParamsUsed] = useState<ConvertParams>({
    amount: 0,
    fromCurrency: '',
    toCurrency: '',
  });

  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [changePercent, setChangePercent] = useState<number>(0);

  const fetchRates = useCallback(async () => {
    // API endpoint only updates data every minute, so conversion is done using 'cached' rates
    // Only fetch new rates if there is (potential) update.
    // 2 minutes is used here to further reduce the number of requests made.
    // Preferably this would be done on own backend, then backend would handle the caching.
    if (
      lastFetchTime !== undefined &&
      new Date().getTime() - lastFetchTime.getTime() < 2 * 60 * 1000
    ) {
      return rates;
    }

    try {
      const res = await client.fetchFluctuation({
        startDate: formatDate(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)),
        endDate: formatDate(new Date()),
      });

      const data = await res.json();

      setLastFetchTime(new Date());
      setRates(data['rates']);
      return rates;
    } catch (err) {
      console.error(err);
      return {};
    }
  }, [lastFetchTime, rates]);

  useEffect(() => {
    if (lastFetchTime === undefined) {
      // Fetch at start
      fetchRates();
    }
  }, [fetchRates, lastFetchTime]);

  const convertFromRates = useCallback((amount, fromRate, toRate) => {
    return amount * (toRate / fromRate);
  }, []);

  const convert = useCallback(
    async ({ amount, fromCurrency, toCurrency }) => {
      const rates = await fetchRates();

      if (rates === {} || amount === 0 || fromCurrency === '' || toCurrency === '') return;

      setParamsUsed({ amount, fromCurrency, toCurrency });

      const fromRate = rates[fromCurrency]['end_rate'];
      const toRate = rates[toCurrency]['end_rate'];

      const fromPastRate = rates[fromCurrency]['start_rate'];
      const toPastRate = rates[toCurrency]['start_rate'];

      const converted = convertFromRates(amount, fromRate, toRate);

      setConvertedAmount(converted);
      setChangePercent(
        convertFromRates(1, fromRate, toRate) / convertFromRates(1, fromPastRate, toPastRate) - 1,
      );

      // Simulate API wait time if wanted
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      return;
    },
    [convertFromRates, fetchRates],
  );

  return {
    convert,
    paramsUsed,
    convertedAmount,
    changePercent,
  };
};
