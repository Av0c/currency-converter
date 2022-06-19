import { Autocomplete, createFilterOptions, TextField } from '@mui/material';
import { Flags } from '@utils';
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
          <img
            src={Flags[(option as string).toLowerCase()] || Flags['$$$']}
            height={16}
            style={{ borderRadius: 2, marginRight: '8px' }}
          />
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
