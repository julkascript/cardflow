import { changelogBullet } from './ChangelogBullet';
import ChangelogListItem from './ChangelogListItem';

type ChangelogListProps = {
  items: string[];
  heading: string;
  type: changelogBullet;
  /**
   * Prevents duplicate keys if there are features/deprecations/fixes
   * that happen to have the same content but different versions.
   */
  version: string;
};

/**
 * Renders a section (features, fixes, or deprecations) of a version's changelog.
 * If the section has no items (i.e. no features, fixes, or deprecations),
 * this component does not render anything
 */
function ChangelogList(props: ChangelogListProps): JSX.Element {
  if (props.items.length === 0) {
    return <></>;
  }

  return (
    <div className="mb-16">
      <h3 className="font-bold text-left text-2xl mb-2">{props.heading}</h3>
      <ul>
        {props.items.map((item) => (
          <ChangelogListItem
            key={`changelog-list-item-${item}-${props.version}-${props.type}`}
            text={item}
            type={props.type}
          />
        ))}
      </ul>
    </div>
  );
}

export default ChangelogList;
