import { Input as MuiInput } from '@mui/material';
import { styled } from '@mui/system';

const StyledInput = styled(MuiInput)(({ theme }) => ({
  width: '392px',
  fontFamily: 'Inter',
  fontSize: '17px',
  fontWeight: 400,
  lineHeight: '1.5',
  padding: '5px 12px',
  borderRadius: '5px',
  marginBottom: '15px',
  color: theme.palette.mode === 'dark' ? theme.palette.grey['300'] : theme.palette.grey['900'],
  background: theme.palette.mode === 'dark' ? theme.palette.grey['900'] : '#fff',
  border: `0.5px solid ${theme.palette.grey['400']}`,
  boxShadow: `0px 2px 2px ${
    theme.palette.mode === 'dark' ? theme.palette.grey['900'] : theme.palette.grey['50']
  }`,
  '&:hover': {
    borderColor: theme.palette.grey['900'],
  },
  '&:focus': {
    outline: '0',
    borderColor: theme.palette.grey['900'],
  },
  '&.MuiInput-root': {
    '&:before': {
      borderBottom: 'none', // Remove the specific border-bottom style
    },
    '&:hover:not(.Mui-disabled, .Mui-error):before': {
      borderBottom: 'none',
      borderColor: 'transperant',
    },
    '&:focus:not(.Mui-disabled, .Mui-error):before': {
      borderBottom: 'none',
    },
  },
}));

export default StyledInput;
