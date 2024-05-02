import { Typography } from '@mui/material';
import React from 'react';

type YugiohCardDetailsCellProps = {
  heading: string;
  data: string | number | React.ReactNode;
};

function YugiohCardDetailsCell(props: YugiohCardDetailsCellProps): JSX.Element {
  return (
    <td className="px-4 lg:px-8 first:border-r-2 border-t-2 w-1/2">
      <div className="flex justify-between items-center text-sm lg:text-base lg:block">
        <h3>{props.heading}</h3>
        <Typography component="p" className="hidden lg:block" color="text.secondary">
          {props.data}
        </Typography>
        <Typography
          textAlign="center"
          component="p"
          className="block lg:hidden"
          fontSize={14}
          color="text.secondary"
        >
          {props.data}
        </Typography>
      </div>
    </td>
  );
}

export default YugiohCardDetailsCell;
