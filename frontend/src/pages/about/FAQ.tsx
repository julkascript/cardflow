import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import PageSection from '../../components/PageSection';
import ListingTopBar from '../../components/sellListing/ListingTopBar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { faq } from '../../constants/faq';

function FAQ(): JSX.Element {
  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      href: '/about',
      text: 'About',
    },
  ];
  return (
    <section className="bg-[#F5F5F5] min-h-[100vh] pb-4">
      <ListingTopBar />
      <BreadcrumbNavigation links={breadcrumbNavigation} heading="FAQ" />
      <PageSection className="mt-4 w-11/12 py-4 lg:w-4/5 mx-auto">
        <h2 className="text-2xl text-center lg:text-left lg:px-12 px-8 pt-4 pb-8 text-bold">
          Frequently asked questions
        </h2>
        <div className="w-11/12 mx-auto">
          {faq.map((item) => (
            <Accordion className="mx-auto" sx={{ backgroundColor: '#FBFBFB' }} key={item.question}>
              <AccordionSummary
                id={`${item.question}-header`}
                aria-controls={`${item.question}-content`}
                expandIcon={<ExpandMoreIcon />}
              >
                {item.question}
              </AccordionSummary>
              <AccordionDetails>
                {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </PageSection>
    </section>
  );
}

export default FAQ;
