import { Input, inputClasses } from '@mui/base/Input';
import { styled } from '@mui/system';

const StyledInput = styled(Input)(
  ({ theme }) => `
  
    .${inputClasses.input} {
      width: 392px;
      font-family: Inter;
      font-size: 17px;
      font-weight: 400;
      line-height: 1.5;
      padding: 5px 12px;
      border-radius: 5px;
      margin-bottom: 15px;
      color: ${
        theme.palette.mode === 'dark' ? theme.palette.grey['300'] : theme.palette.grey['900']
      };
      background: ${theme.palette.mode === 'dark' ? theme.palette.grey['900'] : '#fff'};
      border: 0.5px solid ${theme.palette.grey['400']};
      box-shadow: 0px 2px 2px ${
        theme.palette.mode === 'dark' ? theme.palette.grey['900'] : theme.palette.grey['50']
      };
  
      &:hover {
        border-color: ${theme.palette.grey['900']};
      }
  
      &:focus {
        outline: 0;
        border-color: ${theme.palette.grey['900']};
      }
    }
  `,
);

export default StyledInput;
