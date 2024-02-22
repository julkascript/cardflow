import { Button, Divider, SvgIconTypeMap, Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import PageSection from '../../components/PageSection';
import Logo from '../../components/logo/Logo';
import ListingTopBar from '../../components/sellListing/ListingTopBar';
import { theme } from '../../constants/theme';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GitHubIcon from '@mui/icons-material/GitHub';
import HelpIcon from '@mui/icons-material/Help';
import EmailIcon from '@mui/icons-material/Email';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import YugiohImage from '../../../assets/yugioh.png';
import MTGImage from '../../../assets/magicthegathering.png';
import PokemonImage from '../../../assets/pokemon.png';
import WoWImage from '../../../assets/worldofwarcraft.png';
import OnePieceImage from '../../../assets/onepiece.png';
import CardfightVanguardImage from '../../../assets/cardfightvanguard.png';
import React from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type CardflowReasons = {
  logoColor: string;
  reason: string;
};

function About(): JSX.Element {
  const cardflowReasons: CardflowReasons[] = [
    {
      reason: 'Free',
      logoColor: theme.palette.success.main,
    },
    {
      reason: 'Open-source',
      logoColor: theme.palette.info.main,
    },
    {
      reason: 'User-oriented',
      logoColor: theme.palette.error.light,
    },
  ];
  return (
    <section className="bg-[#F5F5F5] min-h-[100vh]">
      <ListingTopBar />
      <PageHeader heading="About" />
      <div className="w-5/6 mx-auto my-4">
        <PageSection className="p-8 my-4">
          <h2 className="text-2xl mb-12 font-bold">Why Cardflow?</h2>
          <div className="flex justify-evenly">
            {cardflowReasons.map((r, i) => (
              <>
                <div className="text-center flex items-center flex-col gap-6">
                  <Logo size={60} textColor={r.logoColor} />
                  <p className="text-2xl">{r.reason}</p>
                </div>
                {i < cardflowReasons.length - 1 ? (
                  <Divider flexItem orientation="vertical" variant="inset" />
                ) : (
                  <></>
                )}
              </>
            ))}
          </div>
        </PageSection>
        <PageSection className="p-8 my-4">
          <div>
            <p>
              Buy, sell and trade for free.{' '}
              <Typography component="span" color="text.secondary">
                Cardflow allows you to list items, buy and exchange with others in matter of
                seconds, without cost.
              </Typography>
            </p>
            <LinkButton icon={ArrowRightIcon}>Start exploring</LinkButton>
          </div>
          <Divider />
          <div>
            <p>
              Join the community.{' '}
              <Typography component="span" color="text.secondary">
                Become a part of the team, contribute to the growth.
              </Typography>
            </p>
            <LinkButton icon={GitHubIcon}>Contribute</LinkButton>
            <LinkButton icon={FavoriteIcon}>Donate</LinkButton>
          </div>
        </PageSection>
        <PageSection className="p-8 my-4">
          <h2 className="text-2xl">Supported games</h2>
          <div>
            <img src={YugiohImage} alt="" />
            <img src={MTGImage} alt="" />
            <img src={PokemonImage} alt="" />
            <img src={WoWImage} alt="" />
            <img src={OnePieceImage} alt="" />
            <img src={CardfightVanguardImage} alt="" />
          </div>
        </PageSection>
        <PageSection className="p-8 my-4">
          <h2 className="text-2xl font-bold">There's so much more.</h2>
          <LinkButton icon={HelpIcon}>FAQ</LinkButton>
          <LinkButton icon={EmailIcon}>Reach out to us</LinkButton>
          <LinkButton icon={CompareArrowsIcon}>What's changed</LinkButton>
        </PageSection>
      </div>
    </section>
  );
}

function LinkButton(props: {
  children: React.ReactNode;
  icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string;
  };
  // href: string;
  target?: '_blank';
}): JSX.Element {
  const Icon = props.icon;

  return (
    <Button
      startIcon={<Icon fontSize={'large'} />}
      variant="outlined"
      sx={{ color: theme.palette.text.secondary, borderRadius: 30, textTransform: 'none' }}
      size="large"
      // target={props.target}
    >
      {props.children}
    </Button>
  );
}

export default About;
