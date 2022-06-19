export * from './flags';

export const formatReadableNumber = (number: number) => {
  return (
    Math.trunc(number).toLocaleString('fi') +
    (number >= 1 ? (number % 1).toFixed(2).slice(1) : (number % 1).toPrecision(2).slice(1))
  );
};

export const formatDate = (date: Date) => {
  return (
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2)
  );
};
