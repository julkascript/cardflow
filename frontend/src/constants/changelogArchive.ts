/**
 * This array is used to render the changelog. For each new version release,
 * you should simply update the archive and the changelog page will also be updated.
 *
 * The versions are ordered by their release dates descending, meaning
 * that the newest version should be the first element.
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
    version: '0.9.0',
    date: 'February 2, 2024',
    features: ['Basic listings', 'Checkout', 'Profile and settings'],
    fixes: ['Inconsistent listings', 'Authentication tokens'],
    deprecated: ['Instant buy'],
  },
]);

type ChangelogArchive = {
  version: string;
  date: string;
  features: string[];
  fixes: string[];
  deprecated: string[];
};
