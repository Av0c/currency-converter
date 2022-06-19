import { useCallback, useEffect, useState } from 'react';
import * as client from '@client';

interface Context {
  symbols: Record<string, string>;
}

export const useSymbols = (): Context => {
  const [symbols, setSymbols] = useState<Record<string, string>>({});

  const fetchSymbols = useCallback(() => {
    client
      .fetchSymbols()
      .then((res) => res.json())
      .then((data) => setSymbols(data['symbols']))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    fetchSymbols();
  }, [fetchSymbols]);

  return {
    symbols,
  };
};
