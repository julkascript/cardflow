import { Button, Divider, SvgIconTypeMap, SxProps, Typography } from '@mui/material';
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
import React, { HTMLAttributeAnchorTarget } from 'react';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import SupportedGamesImage from '../../components/about/SupportedGamesImage';

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
          <h2 className="text-2xl mb-12 font-bold text-center lg:text-center">Why Cardflow?</h2>
          <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row lg:justify-center">
            {cardflowReasons.map((r, i) => (
              <>
                <div className="w-full justify-center flex items-center flex-col gap-6">
                  <Logo size={60} textColor={r.logoColor} />
                  <p className="text-2xl">{r.reason}</p>
                </div>
                {i < cardflowReasons.length - 1 ? (
                  <>
                    <Divider
                      className="none lg:block"
                      flexItem
                      orientation="vertical"
                      variant="inset"
                    />
                    <Divider className="block lg:none" sx={{ marginBottom: 2 }} variant="inset" />
                  </>
                ) : (
                  <></>
                )}
              </>
            ))}
          </div>
        </PageSection>
        <PageSection className="p-8 my-4 flex flex-col gap-4 lg:flex-row lg:gap-0">
          <div className="flex flex-col lg:w-5/6">
            <h2 className="text-2xl text-center lg:text-left">Buy, sell and trade for free</h2>
            <Typography
              className="text-center lg:text-left"
              sx={{ marginBottom: 2 }}
              component="p"
              color="text.secondary"
            >
              Cardflow allows you to list items, buy and exchange with others in matter of seconds,
              without cost.
            </Typography>
            <LinkButton
              href="/buy"
              className="w-44 self-center lg:self-start"
              icon={ArrowRightIcon}
            >
              Start exploring
            </LinkButton>
          </div>
          <Divider sx={{ marginTop: 2 }} className="block lg:none" />
          <Divider variant="inset" flexItem orientation="vertical" className="none lg:block" />
          <div className="flex flex-col lg:w-full">
            <h2 className="text-2xl lg:pl-8 text-center lg:text-left">Join the community</h2>
            <Typography
              className="text-center lg:text-left lg:pl-8"
              sx={{ marginBottom: 2 }}
              component="p"
              color="text.secondary"
            >
              Become a part of the team, contribute to the growth.
            </Typography>
            <div className="flex flex-col w-36 mx-auto gap-4 lg:flex-row lg:w-full lg:pl-8 lg:pt-5">
              <LinkButton
                href="https://github.com/julkascript/cardflow"
                target="_blank"
                icon={GitHubIcon}
              >
                Contribute
              </LinkButton>
              <LinkButton href="#" icon={FavoriteIcon}>
                Donate
              </LinkButton>
            </div>
          </div>
        </PageSection>
        <PageSection className="p-8 my-4">
          <h2 className="text-2xl text-center lg:text-left">Supported games</h2>
          <div className="mt-4 gap-12 flex flex-col items-center lg:grid lg:grid-cols-3 lg:place-items-center">
            <SupportedGamesImage src={YugiohImage} game="Yu-Gi-Oh!" />
            <SupportedGamesImage comingSoon src={MTGImage} game="Magic the Gathering" />
            <SupportedGamesImage
              last
              comingSoon
              src={PokemonImage}
              game="Pokémon Trading Card Game"
            />
            <SupportedGamesImage
              marginTop={8}
              src={WoWImage}
              comingSoon
              game="World of Warcraft Trading Card Game"
            />
            <SupportedGamesImage
              comingSoon
              marginTop={8}
              src={OnePieceImage}
              game="One Piece Card Game"
            />
            <SupportedGamesImage
              marginTop={8}
              src={CardfightVanguardImage}
              comingSoon
              last
              game="Cardfight! Vanguard"
            />
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
  href: string;
  target?: HTMLAttributeAnchorTarget;
  className?: string;
  sx?: SxProps;
}): JSX.Element {
  const Icon = props.icon;
  const sx = props.sx ? props.sx : {};

  return (
    <Button
      startIcon={<Icon fontSize={'large'} />}
      variant="outlined"
      sx={{ color: theme.palette.text.secondary, borderRadius: 30, textTransform: 'none', ...sx }}
      size="large"
      className={props.className}
      target={props.target}
      href={props.href}
    >
      {props.children}
    </Button>
  );
}

export default About;
