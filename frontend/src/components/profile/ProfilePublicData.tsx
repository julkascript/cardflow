import { Avatar, Divider, Typography } from '@mui/material';
import TrophyIcon from '@mui/icons-material/EmojiEvents';

function ProfilePublicData(): JSX.Element {
  return (
    <section className="border-stone-300 border-2 rounded-lg text-center lg:text-left">
      <div className="p-4 pl-12 flex flex-col-reverse lg:justify-between lg:flex-row">
        <div>
          <h2 className="font-bold text-2xl mb-2">@TheAverageTCGEnjoyer</h2>
          <div>Ivan Ivanov</div>
          <Typography color="text.secondary" component="div">
            Sofia
          </Typography>
        </div>
        <div className="flex justify-center lg:block">
          <Avatar src="#" sx={{ width: 80, height: 80 }} />
        </div>
      </div>
      <Divider sx={{ width: '90%', margin: '0 auto' }} />
      <div className="mb-2 p-4 pl-12">
        <h3 className="font-bold mb-4">Achievements</h3>
        <div className="flex flex-row gap-4 flex-wrap justify-center lg:justify-normal">
          <Avatar>
            <TrophyIcon />
          </Avatar>
          <Avatar>
            <TrophyIcon />
          </Avatar>
        </div>
      </div>
      <div>
        <Typography
          color="text.secondary"
          component="p"
          className="bg-[#F5F5F5] p-4 pl-12 rounded-lg rounded-t-none"
        >
          Member since 02/03/2024
        </Typography>
      </div>
    </section>
  );
}

export default ProfilePublicData;
