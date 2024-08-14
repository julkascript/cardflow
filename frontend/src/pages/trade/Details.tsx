import { useEffect, useState } from 'react';

function Details(): JSX.Element {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  /* TO-DO: update with chat PR */
  return <h1>Details</h1>;
}

export default Details;
