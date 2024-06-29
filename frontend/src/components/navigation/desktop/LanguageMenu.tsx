import { useTranslation } from 'react-i18next';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { languageCode, languages } from '../../../constants/languages';

const languagesArray = Object.values(languages);

function DesktopLanguageMenu(): JSX.Element {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language === 'en-US' ? languages.en.code : i18n.language;

  function changeLanguage(event: SelectChangeEvent<string>) {
    const value = event.target.value;
    i18n.changeLanguage(value);
  }

  return (
    <FormControl className="hidden lg:block">
      <Select
        sx={{
          // ensures that the flag is centered vertically
          '.MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
          height: 33,
        }}
        renderValue={(value) => (
          <div className="w-6 h-3 flex items-center">
            <img
              alt={languages[value as languageCode].name}
              src={languages[value as languageCode].flag}
            />
          </div>
        )}
        value={currentLanguage}
        autoWidth
        onChange={changeLanguage}
      >
        {languagesArray.map((l) => (
          <MenuItem key={l.code} value={l.code}>
            <img className="w-6 h-3 mr-2" src={l.flag} alt={l.name} />
            <span>
              {l.name} ({l.code})
            </span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default DesktopLanguageMenu;
