import { Link } from '@mui/material';

/**
 * This array is used to render the accordions in the FAQ page.
 *
 * The answers can be defined as any valid React node (such as strings or HTML tags).
 * When the answer is a string, the FAQ page will wrap it in a ``p`` tag.
 * For any other data type, the FAQ page will render whatever you provided.
 *
 * Use string answers when you have simple text. Use other data types
 * when you want to insert more complex markup (e.g. hyperlinks or formatting)
 */
export const faq: readonly FAQ[] = Object.freeze([
  {
    question: 'Is Cardflow free?',
    answer:
      'Yes! Cardflow is entirely free to use. Cardflow does not charge you registration or transaction fees.',
  },
  {
    question: 'How do I create a listing?',
    answer: (
      <>
        <p>
          To create a listing, go to the <Link href="/sell/new">new listing page</Link>. Type in the
          name of your card in the text field and select the specific set of your card. Afterwards,
          select the quality of the card via the dropdown menu and use the text fields to choose the
          amount of cards you want to sell and the price per unit.
        </p>
        <p>
          Please note that only registered users can create listings. If you do not have an account,
          you can <Link href="/register">register for free</Link>.
        </p>
      </>
    ),
  },
  {
    question: 'How do I trade?',
    answer: 'Trading is a planned feature that is currently unavailable. Stay tuned for updates!',
  },
  {
    question: 'How do I delete my account?',
    answer: (
      <>
        <p>
          To delete your account, navigate to your profile settings page and navigate to the bottom,
          where you will find a red-colored section. Afterwards, click the "Delete Account" button
          and your account will be permanently deleted.
        </p>

        <p>
          Please note that{' '}
          <strong>this action is irreversible and any data associated with you will be lost</strong>
          ! Because of this, please proceed with caution .
        </p>
      </>
    ),
  },
  {
    question: 'How do the Achievements work?',
    answer:
      'Achievements are a planned feature that is currently unavailable. Stay tuned for updates!',
  },
  {
    question: 'What happens if I am not satisfied with my order?',
    answer:
      'A feedback system is a planned feature that is currently unavailable. Stay tuned for updates!',
  },
  {
    question: 'How do I report a user?',
    answer: (
      <p>
        You can <Link href="/about/contact">contact us</Link> if you believe that a user is breaking
        Cardflow's policies and terms of use.
      </p>
    ),
  },
  {
    question: 'Can a listing expire?',
    answer: 'Placeholder answer',
  },
  {
    question: 'How do I report a bug?',
    answer: (
      <>
        <p>
          You can either <Link href="/about/contact">contact us</Link> or{' '}
          <Link href="https://github.com/julkascript/cardflow/issues/new" target="_blank">
            raise an issue on our GitHub repository
          </Link>
          . Note that the latter option requires a GitHub account.
        </p>
        <p>
          Please be as detailed and specific as possible when reporting a bug. This will help us
          address it more easily.
        </p>
      </>
    ),
  },
]);

type FAQ = {
  question: string;
  answer: React.ReactNode;
};
