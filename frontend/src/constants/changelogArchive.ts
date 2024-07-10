/**
 * This array provides version milestones and dates, which are used to
 * render the Changelog page.
 *
 * The versions are ordered by their release dates ascending, meaning
 * that the newest version should be the last element
 * (the changelog page handles the sorting itself).
 *
 * The versions are used as translation keys, which are associated
 * with arrays of strings (those arrays being features, fixes, and deprecates).
 * The arrays themselves are parsed to JavaScript arrays, thus
 * you only need to update the .json files with translations
 * to update the page.
 */
export const changelogArchive: readonly ChangelogArchive[] = [
  {
    version: '1.0.0',
    date: new Date('February 2, 2024'),
  },
  {
    version: '1.2.0',
    date: new Date('June 12, 2024'),
  },
  {
    version: '1.3.0',
    date: new Date('July 10, 2024'),
  },
];

type ChangelogArchive = {
  version: string;
  date: Date;
};
