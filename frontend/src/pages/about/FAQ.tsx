import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import PageSection from '../../components/PageSection';
import CardflowTabs from '../../components/cardflowTabs/CardflowTabs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { faq } from '../../constants/faq';
import { useTranslation, Trans } from 'react-i18next';

function FAQ(): JSX.Element {
  const { t } = useTranslation('about');
  const { t: commonT } = useTranslation('common');
  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      href: '/about',
      text: commonT('breadcrumbs.about.title'),
    },
  ];
  return (
    <section className="bg-[#F5F5F5] min-h-[100vh] pb-4">
      <CardflowTabs />
      <BreadcrumbNavigation
        links={breadcrumbNavigation}
        heading={commonT('breadcrumbs.about.faq.title')}
      />
      <PageSection className="mt-4 w-11/12 py-4 lg:w-4/5 mx-auto">
        <h2 className="text-2xl text-center lg:text-left lg:px-12 px-8 pt-4 pb-8 text-bold">
          {t('faq.questions.title')}
        </h2>
        <div className="w-11/12 mx-auto">
          {faq.map((item) => {
            const components = item.components || {};

            return (
              <Accordion
                className="mx-auto"
                sx={{ backgroundColor: '#FBFBFB' }}
                key={item.translationKey}
              >
                <AccordionSummary
                  id={`${item.translationKey}-header`}
                  aria-controls={`${item.translationKey}-content`}
                  expandIcon={<ExpandMoreIcon />}
                >
                  {t(`faq.questions.${item.translationKey}.question`)}
                </AccordionSummary>
                <AccordionDetails>
                  <Trans
                    i18nKey={`faq.questions.${item.translationKey}.answer`}
                    t={t}
                    components={{ p: <p className="mb-4 last:mb-0" />, ...components }}
                  ></Trans>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>
      </PageSection>
    </section>
  );
}

export default FAQ;
