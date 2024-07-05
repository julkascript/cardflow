import { useTranslation } from 'react-i18next';
import PageSection from '../../PageSection';
import { currencies, currency } from '../../../constants/currencies';
import { FormEvent, useState } from 'react';
import { Button, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import ProfileSectionFooter from '../ProfileSectionFooter';

type DefaultCurrencySettingsProps = {
  currency: currency;
  onSubmit: (currency: currency) => void;
};

function DefaultCurrencySettings(props: DefaultCurrencySettingsProps) {
  const { t } = useTranslation('account');
  const { t: commonT } = useTranslation('common');

  const [currency, setCurrency] = useState(props.currency);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    props.onSubmit(currency);
  }

  function handleCurrencyChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.target.value as currency;
    setCurrency(value);
  }
  return (
    <PageSection>
      <form onSubmit={handleSubmit}>
        <div className="pt-4 pb-4 lg:pl-12 lg:pr-12">
          <h2 className="font-bold mb-4 text-lg">{t('details.defaultCurrency.title')}</h2>
          <FormControl>
            <RadioGroup value={currency} onChange={handleCurrencyChange}>
              {currencies.map((c) => (
                <FormControlLabel
                  key={c.code}
                  value={c.code}
                  control={<Radio color="info" />}
                  label={`${commonT(`currencies.${c.code}.name`)} (${c.code})`}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
        <ProfileSectionFooter>
          <p>{t('details.defaultCurrency.hint')}</p>
          <Button
            disabled={props.currency === currency}
            color="primary"
            variant="contained"
            className="inline-block"
            type="submit"
          >
            {t('common.saveButtonText')}
          </Button>
        </ProfileSectionFooter>
      </form>
    </PageSection>
  );
}

export default DefaultCurrencySettings;
