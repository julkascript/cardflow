import { Divider } from '@mui/material';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import PageSection from '../../components/PageSection';
import ChangelogList from '../../components/about/ChangelogList';
import ListingTopBar from '../../components/sellListing/ListingTopBar';
import { changelogArchive } from '../../constants/changelogArchive';

function Changelog(): JSX.Element {
  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      text: 'About',
      href: '/about',
    },
  ];

  return (
    <section className="bg-[#F5F5F5] min-h-[100vh]">
      <ListingTopBar />
      <BreadcrumbNavigation links={breadcrumbNavigation} heading="Changelog" />
      <PageSection className="mt-4 px-12 py-20 w-4/5 mx-auto">
        {changelogArchive.map((milestone, i) => (
          <>
            <section className="flex w-3/5 justify-between" key={milestone.version}>
              <div>
                <h2 className="font-bold">v{milestone.version}</h2>
                <span>{milestone.date}</span>
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
          </>
        ))}
      </PageSection>
    </section>
  );
}

export default Changelog;
