import { Divider } from '@mui/material';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import PageSection from '../../components/PageSection';
import ChangelogList from '../../components/about/ChangelogList';
import CardflowTabs from '../../components/sellListing/CardflowTabs';
import { changelogArchive } from '../../constants/changelogArchive';

const reversedChangelogArchive = [...changelogArchive].reverse();

function Changelog(): JSX.Element {
  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      text: 'About',
      href: '/about',
    },
  ];

  return (
    <section className="bg-[#F5F5F5] min-h-[100vh] pb-4">
      <CardflowTabs />
      <BreadcrumbNavigation links={breadcrumbNavigation} heading="Changelog" />
      <PageSection className="mt-4 lg:px-12 py-4 lg:py-20 w-11/12 lg:w-4/5 mx-auto">
        {reversedChangelogArchive.map((milestone, i) => (
          <div key={milestone.version}>
            <section className="flex items-center lg:items-start lg:w-3/5 flex-col lg:flex-row lg:justify-between">
              <div>
                <h2 className="text-3xl text-center lg:text-left lg:text-base font-bold">
                  v{milestone.version}
                </h2>
                <div className="text-center mb-8 lg:text-left">{milestone.date}</div>
              </div>
              <div>
                <ChangelogList
                  version={milestone.version}
                  type="feature"
                  heading="New features"
                  items={milestone.features}
                />
                <ChangelogList
                  version={milestone.version}
                  type="fix"
                  heading="Fixes"
                  items={milestone.fixes}
                />
                <ChangelogList
                  version={milestone.version}
                  type="deprecation"
                  heading="Deprecated"
                  items={milestone.deprecated}
                />
              </div>
            </section>
            {i < changelogArchive.length - 1 ? <Divider sx={{ marginBottom: 4 }} /> : <></>}
          </div>
        ))}
      </PageSection>
    </section>
  );
}

export default Changelog;
