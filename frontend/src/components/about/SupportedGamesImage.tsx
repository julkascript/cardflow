import { theme } from '../../constants/theme';

type SupportedGamesImageProps = {
  src: string;
  comingSoon?: boolean;
  game: string;
  marginTop?: number;
  last?: boolean;
};

function SupportedGamesImage(props: SupportedGamesImageProps): JSX.Element {
  const altText = props.comingSoon ? `${props.game} (coming soon)` : props.game;
  const blurClass = props.comingSoon ? 'blur-sm' : '';

  return (
    <div className={`relative w-[300px] lg:w-[182px] mt-${props.marginTop || 0}`}>
      <img
        title={altText}
        src={props.src}
        alt={altText}
        className={`w-[300px] lg:w-[182px] ${blurClass}`}
      />
      <ComingSoon visible={props.comingSoon} />
      <div
        className={`none last:none lg:block lg:w-[1px] lg:h-[75px] absolute right-[-91px] top-1/2 bottom-1/2 my-auto ${
          !props.last ? 'lg:border-r' : 'lg-border-none'
        }`}
      ></div>
    </div>
  );
}

function ComingSoon(props: { visible?: boolean; bottom?: number }): JSX.Element {
  if (!props.visible) {
    return <></>;
  }

  return (
    <p
      aria-hidden="true"
      className={`absolute select-none right-[-24px] -rotate-[20deg] text-3xl top-${props.bottom}`}
      style={{ color: theme.palette.error.main, bottom: 8 }}
    >
      Coming soon
    </p>
  );
}

export default SupportedGamesImage;
