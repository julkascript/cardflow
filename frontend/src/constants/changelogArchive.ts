/**
 * This array is used to render the changelog. For each new version release,
 * you should simply update the archive and the changelog page will also be updated.
 *
 * The versions are ordered by their release dates ascending, meaning
 * that the newest version should be the last element
 * (the changelog page handles the sorting itself).
 *
 * If a version is missing new features, fixes, or deprecations, you
 * should simply supply an empty array for the respective category.
 *
 * The ``version`` should not be prepended by a "v", this will be done by the component itself.
 */
export const changelogArchive: readonly ChangelogArchive[] = Object.freeze([
  {
    version: '1.0.0',
    date: 'February 2, 2024',
    features: ['Basic listings', 'Checkout', 'Profile and settings'],
    fixes: ['Inconsistent listings', 'Authentication tokens'],
    deprecated: ['Instant buy'],
  },
  {
    version: '1.2.0',
    date: 'June 12, 2024',
    features: ['Improved user feedback', 'Improved navigation', 'Show image previews'],
    fixes: ['Best sellers fixes', 'Fixed delisting bugs'],
    deprecated: [],
  },
]);

type ChangelogArchive = {
  version: string;
  date: string;
  features: string[];
  fixes: string[];
  deprecated: string[];
};
