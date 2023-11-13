import { Avatar, Divider, Typography } from '@mui/material';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import PageSection from '../pageSection/PageSection';

function ProfilePublicData(): JSX.Element {
  return (
    <PageSection className="text-center lg:text-left mb-8">
      <div className="pt-4 pb-4 lg:pl-12 lg:pr-12 flex flex-col-reverse lg:justify-between lg:flex-row">
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
      <div className="mb-2 pt-4 pb-4 lg:p-4 lg:pl-12">
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
    </PageSection>
  );
}

export default ProfilePublicData;
