import { useTranslation } from 'react-i18next';
import { theme } from '../../constants/theme';

type SupportedGamesImageProps = {
  src: string;
  comingSoon?: boolean;
  game: string;
  marginTop?: number;
  last?: boolean;
};

function SupportedGamesImage(props: SupportedGamesImageProps): JSX.Element {
  const { t } = useTranslation('about');
  const altText = props.comingSoon
    ? `${props.game} (${t('main.thirdSection.comingSoon')})`
    : props.game;
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
    </div>
  );
}

function ComingSoon(props: { visible?: boolean }): JSX.Element {
  const { t } = useTranslation('about');

  if (!props.visible) {
    return <></>;
  }

  return (
    <p
      aria-hidden="true"
      className="absolute select-none right-[-24px] -rotate-[20deg] text-3xl"
      style={{ color: theme.palette.error.main, bottom: 8 }}
    >
      {t('main.thirdSection.comingSoon')}
    </p>
  );
}

export default SupportedGamesImage;
