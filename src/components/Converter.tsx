import { useConvert, useSymbols } from '@hooks';
import { SwapVert } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { formatReadableNumber } from '@utils';
import React, { useCallback, useState } from 'react';
import { CurrencySelect } from './CurrencySelect';

export const Converter = (): React.ReactElement => {
  const [amount, setAmount] = useState<number>(0);

  const [showResult, setShowResult] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');

  const { symbols } = useSymbols();
  const { paramsUsed, convertedAmount, changePercent, convert } = useConvert();

  const handleSetCurrency = useCallback(
    (which: 'from' | 'to', value: string) => {
      if (which === 'from') {
        // Setting fromCurrency
        if (value === toCurrency) {
          // Swap
          setToCurrency(fromCurrency);
        }
        setFromCurrency(value);
      } else {
        // Setting toCurrency
        if (value === fromCurrency) {
          // Swap
          setFromCurrency(toCurrency);
        }
        setToCurrency(value);
      }
    },
    [fromCurrency, toCurrency],
  );

  return (
    <Card sx={{ p: 2, width: '460px' }}>
      <TextField
        id='convert-amount-input'
        onChange={(event) => {
          setShowResult(false);
          setAmount(Number(event.target.value));
        }}
        type='number'
        value={amount}
        fullWidth
        variant='standard'
        label='Amount'
        sx={{ mb: 4 }}
      />
      <Grid container sx={{ mb: 4 }} columnSpacing={1}>
        <Grid item xs={true}>
          <CurrencySelect
            label='Convert From'
            options={Object.keys(symbols)}
            symbols={symbols}
            value={fromCurrency}
            setValue={(value) => handleSetCurrency('from', value)}
            onChange={() => setShowResult(false)}
          />
          <Box sx={{ mb: 2 }} />
          <CurrencySelect
            label='Convert To'
            options={Object.keys(symbols)}
            symbols={symbols}
            value={toCurrency}
            setValue={(value) => handleSetCurrency('to', value)}
            onChange={() => setShowResult(false)}
          />
        </Grid>
        <Grid
          item
          xs='auto'
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <IconButton
            disabled={toCurrency === '' || fromCurrency === ''}
            onClick={() => {
              setShowResult(false);
              const currentFrom = fromCurrency;
              setFromCurrency(toCurrency);
              setToCurrency(currentFrom);
            }}
          >
            <SwapVert />
          </IconButton>
        </Grid>
      </Grid>
      <Button
        fullWidth
        variant='contained'
        onClick={async () => {
          setIsLoading(true);
          await convert({ amount, fromCurrency, toCurrency });
          setIsLoading(false);
          setShowResult(true);
        }}
        disabled={amount === 0 || fromCurrency === '' || toCurrency === '' || isLoading}
      >
        Convert
        {isLoading && <CircularProgress size={16} thickness={6} color='inherit' sx={{ ml: 1 }} />}
      </Button>
      <Collapse in={showResult}>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Typography sx={{ mb: 1 }}>
          {formatReadableNumber(paramsUsed.amount)} {symbols[paramsUsed.fromCurrency]} equals
        </Typography>
        <Typography variant='h4'>
          {formatReadableNumber(convertedAmount)} {symbols[paramsUsed.toCurrency]}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          This rate {changePercent < 0 ? 'decreased' : 'increased'} by{' '}
          <Typography component='span' color={changePercent < 0 ? 'red' : 'green'}>
            {Math.abs(changePercent * 100).toFixed(2)}%
          </Typography>{' '}
          compared to last month.
        </Typography>
      </Collapse>
    </Card>
  );
};
