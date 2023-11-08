import { Button } from '@mui/material';
import Logo from '../logo/Logo';

function Home(): JSX.Element {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex">
        <h1 className="text-9xl font-extrabold px-4 py-2 text-[#007FEF]">Buy.</h1>
        <h1 className="text-9xl font-extrabold px-4 py-2 text-[#7E27C7]">Sell.</h1>
        <h1 className="text-9xl font-extrabold px-4 py-2 text-[#FF544B]">Trade.</h1>
      </div>
      <p className="text-lg mt-2 font-normal text-inter text-[#6F6F6F] mt-2">
        Cardflow provides you with the tools and infrastructure
      </p>
      <p className="text-lg mt-2 font-normal text-inter text-[#6F6F6F] mt-2">
        to move your cards from A to B.
      </p>
      <div className="flex mt-2 pt-20">
        <div className="pr-40">
          <Button
            variant="contained"
            sx={{ color: 'white', padding: '10px', width: 210, textTransform:"none" }}
            startIcon={<Logo color="white" size={20}/>}
          >
            Start exploring
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            sx={{ color: 'black', backgroundColor: 'white', width: 210, padding: '10px', textTransform:"none" }}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
