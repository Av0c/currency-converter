import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import React from 'react';

interface Props {
  options: string[];
  label: string;
  symbols: Record<string, string>;
  value: string;
  setValue: (value: string) => void;
  onChange: () => void;
}

export const CurrencySelect = ({
  options,
  label,
  symbols,
  value,
  setValue,
  onChange,
}: Props): React.ReactElement => {
  const filterOptions = createFilterOptions({
    matchFrom: 'start',
  });

  return (
    <Autocomplete
      options={options}
      fullWidth
      renderInput={(params) => <TextField {...params} label={label} />}
      noOptionsText='Unknown currency'
      disableClearable
      autoHighlight
      filterOptions={filterOptions}
      renderOption={(props, option) => (
        <li {...props}>
          {option} - {symbols[option as string]}
        </li>
      )}
      value={value === '' ? null : value}
      onChange={(_, newValue) => {
        setValue(newValue as string);
        onChange();
      }}
    />
  );
};
