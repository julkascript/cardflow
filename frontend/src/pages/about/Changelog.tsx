import { Divider } from '@mui/material';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import PageSection from '../../components/PageSection';
import ChangelogList from '../../components/about/ChangelogList';
import CardflowTabs from '../../components/cardflowTabs/CardflowTabs';
import { changelogArchive } from '../../constants/changelogArchive';
import { useTranslation } from 'react-i18next';

const reversedChangelogArchive = [...changelogArchive].reverse();

function Changelog(): JSX.Element {
  const { t, i18n } = useTranslation('about');
  const { t: commonT } = useTranslation('common');

  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      text: commonT('breadcrumbs.about.title'),
      href: '/about',
    },
  ];

  return (
    <section className="bg-[#F5F5F5] min-h-[100vh] pb-4">
      <CardflowTabs />
      <BreadcrumbNavigation
        links={breadcrumbNavigation}
        heading={commonT('breadcrumbs.about.changelog.title')}
      />
      <PageSection className="mt-4 lg:px-12 py-4 lg:py-20 w-11/12 lg:w-4/5 mx-auto">
        {reversedChangelogArchive.map((milestone, i) => {
          const features: string[] = t(`changelog.${milestone.version}.features`, {
            returnObjects: true,
          });
          const fixes: string[] = t(`changelog.${milestone.version}.fixes`, {
            returnObjects: true,
          });
          const deprecated: string[] = t(`changelog.${milestone.version}.deprecated`, {
            returnObjects: true,
          });
          return (
            <div key={milestone.version}>
              <section className="lg:flex block items-start flex-row justify-between">
                <div>
                  <h2 className="text-3xl text-center lg:text-left lg:text-base font-bold">
                    v{milestone.version}
                  </h2>
                  <div className="text-center mb-8 lg:text-left">
                    <MilestoneDate date={milestone.date} locale={i18n.language} />
                  </div>
                </div>
                <div className="lg:w-3/5">
                  <ChangelogList
                    version={milestone.version}
                    type="feature"
                    heading={t('changelog.features')}
                    items={features}
                  />
                  <ChangelogList
                    version={milestone.version}
                    type="fix"
                    heading={t('changelog.fixes')}
                    items={fixes}
                  />
                  <ChangelogList
                    version={milestone.version}
                    type="deprecation"
                    heading={t('changelog.deprecated')}
                    items={deprecated}
                  />
                </div>
              </section>
              {i < reversedChangelogArchive.length - 1 ? (
                <Divider sx={{ marginBottom: 4 }} />
              ) : (
                <></>
              )}
            </div>
          );
        })}
      </PageSection>
    </section>
  );
}

function MilestoneDate({ date, locale }: { date: Date; locale: string }): JSX.Element {
  const formattedDate = date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return <div className="text-center mb-8 lg:text-left">{formattedDate}</div>;
}

export default Changelog;
