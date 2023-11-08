import { Button } from '@mui/material';
import Logo from '../logo/Logo';

function Home(): JSX.Element {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex">
        <h1 className="text-9xl font-extrabold px-4 py-2">Buy.</h1>
        <h1 className="text-9xl font-extrabold px-4 py-2">Sell.</h1>
        <h1 className="text-9xl font-extrabold px-4 py-2">Trade.</h1>
      </div>
      <p className="text-lg mt-2 font-normal text-inter text-[#6F6F6F] mt-2">
        Cardflow provides you with the tools and infrastructure
      </p>
      <p className="text-lg mt-2 font-normal text-inter text-[#6F6F6F] mt-2">
        to move your cards from A to B.
      </p>
      <div className="flex mt-2">
        <Button
          variant="contained"
          startIcon={<Logo color='white' size={33} />}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mr-2"
        >
          Start exploring
        </Button>
        <Button
          variant="contained"
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default Home;
