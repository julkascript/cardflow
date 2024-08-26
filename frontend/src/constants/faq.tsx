import { Link } from '@mui/material';

/**
 * This array provides the translation keys which are then used to render the FAQ page.
 *
 * In additition to providing translation keys, you can also define components and tags
 * which will be interpolated in the answer associated with the key. This can be used
 * for formatting and other more complex markup which you may want to include in the answers.
 *
 * **Note:** each block of text surrounded by <p> tags (in the translation itself) will be interpolated
 * by the FAQ page itself, you do not have to provide that yourself
 */
export const faq: readonly FAQ[] = Object.freeze([
  {
    translationKey: 'cardflowFree',
  },
  {
    translationKey: 'createListing',
    components: {
      linkToListingPage: <Link href="/sell/new" />,
      linkToRegister: <Link href="/register" />,
    },
  },
  {
    translationKey: 'trading',
  },
  {
    translationKey: 'deleteAccount',
  },
  {
    translationKey: 'achievements',
  },
  {
    translationKey: 'notSatisfiedWithOrder',
  },
  {
    translationKey: 'report',
    components: {
      linkToContact: <Link href="/about/contact" />,
    },
  },
  {
    translationKey: 'listingExpiration',
    components: {
      ol: <ol className="list-decimal p-6" />,
      li: <li className="mb-2" />,
    },
  },
  {
    translationKey: 'reportingABug',
    components: {
      linkToContact: <Link href="/about/contact" />,
      linkToGitHub: (
        <Link href="https://github.com/julkascript/cardflow/issues/new" target="_blank" />
      ),
    },
  },
]);

type FAQ = {
  translationKey: string;
  components?: object;
};
