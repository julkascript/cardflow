import { Button, TextField, Typography } from '@mui/material';
import BreadcrumbNavigation, { BreadcrumbLink } from '../../components/BreadcrumbNavigation';
import CardflowTabs from '../../components/sellListing/CardflowTabs';
import { theme } from '../../constants/theme';
import { Link } from '@mui/material';
import { useState } from 'react';
import { useDebounce } from '../../util/useDebounce';
import { contactService } from '../../services/contact/contact';
import { toastMessages } from '../../constants/toast';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../util/useToast';
import { Trans, useTranslation } from 'react-i18next';

function Contact(): JSX.Element {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const toast = useToast();
  const { t } = useTranslation('about');
  const { t: commonT } = useTranslation('common');

  const navigate = useNavigate();

  const emailIsValid = /^.+@.+$/gim.test(email);
  const messageIsValid = message !== '';

  const debouncedEmailInput = useDebounce(() => setHasNotInputtedEmail(false));

  const [hasNotInputtedEmail, setHasNotInputtedEmail] = useState(true);
  const [hasNotInputtedMessage, setHasNotInputtedMessage] = useState(true);

  const breadcrumbNavigation: BreadcrumbLink[] = [
    {
      href: '/about',
      text: commonT('breadcrumbs.about.title'),
    },
  ];

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    contactService
      .sendEmail({ email, message })
      .then(() => {
        toast.success({ toastKey: toastMessages.emailSent });
        navigate('/');
      })
      .catch((error) => toast.error({ error }));
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setEmail(event.target.value);

    if (hasNotInputtedEmail) {
      debouncedEmailInput();
    }
  }

  function handleMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setMessage(event.target.value);

    if (hasNotInputtedMessage) {
      setTimeout(() => {
        setHasNotInputtedMessage(false);
      }, 1000);
    }
  }

  return (
    <section className="bg-[#f5f5f5] min-h-[100vh] pb-4">
      <CardflowTabs />
      <BreadcrumbNavigation
        links={breadcrumbNavigation}
        heading={commonT('breadcrumbs.about.contact.title')}
      />
      <div className="w-5/6 mx-auto mt-4 lg:flex">
        <section
          className={`flex flex-col text-center rounded-tl-lg border-[${theme.palette.secondary.main}] rounded-tr-lg border-x border-t lg:rounded-tr-none lg:border-b lg:text-left`}
        >
          <div className="p-4 lg:p-8 pb-24">
            <h2 className="text-3xl lg:mb-8">{t('common.reachOutToUs')}</h2>
            <p>{t('contact.paragraph')}</p>
          </div>
          <div className="hidden lg:flex mt-auto">
            <div className={`w-full h-[117px] border border-${theme.palette.secondary.main}`}></div>
            <div className={`w-full h-[117px] border border-${theme.palette.secondary.main}`}></div>
            <div className={`w-full h-[117px] border border-${theme.palette.secondary.main}`}></div>
          </div>
        </section>
        <section
          className={`rounded-br-lg rounded-bl-lg bg-white p-8 border-x border-b border-[${theme.palette.secondary.main}] lg:border-l-0 lg:rounded-tl-none lg:border-t lg:rounded-bl-none`}
        >
          <form onSubmit={handleSubmit} className="text-center lg:text-left">
            <label className="block mb-16">
              <h3 className="text-xl lg:mb-4">{t('contact.emailField.label')}</h3>
              <TextField
                error={!emailIsValid && !hasNotInputtedEmail}
                value={email}
                onChange={handleEmailChange}
                size="small"
                className="w-5/6 lg:w-full"
                placeholder={t('contact.emailField.placeholder')}
                helperText={
                  emailIsValid || hasNotInputtedEmail
                    ? undefined
                    : t('contact.emailField.errorMessage')
                }
              />
            </label>
            <label className="block mb-16">
              <h3 className="text-xl lg:mb-4">{t('contact.messageField.label')}</h3>
              <TextField
                error={!messageIsValid && !hasNotInputtedMessage}
                value={message}
                onChange={handleMessageChange}
                multiline
                minRows={5}
                className="w-11/12 lg:w-full"
                placeholder={t('contact.messageField.placeholder')}
                helperText={
                  messageIsValid || hasNotInputtedMessage
                    ? undefined
                    : t('contact.messageField.errorMessage')
                }
              />
            </label>
            <div className="flex gap-4 flex-col lg:flex-row items-center justify-between">
              <Typography className="w-full" component="p" color="text.secondary">
                <Trans
                  t={t}
                  i18nKey={'contact.privacyPolicy'}
                  components={{
                    linkToPrivacyPolicy: (
                      <Typography color="text.secondary" component={Link} href="/about/privacy" />
                    ),
                  }}
                ></Trans>
              </Typography>
              <Button
                variant="contained"
                className="w-11/12 lg:w-1/2"
                type="submit"
                sx={{
                  backgroundColor: '#0072F5',
                  borderRadius: 20,
                  padding: 2,
                }}
                disabled={!emailIsValid || !messageIsValid}
              >
                {t('contact.submitText')}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </section>
  );
}

export default Contact;
