import ChangelogBullet, { changelogBullet } from './ChangelogBullet';

type ChangelogListItemProps = {
  type: changelogBullet;
  text: string;
};

function ChangelogListItem(props: ChangelogListItemProps): JSX.Element {
  return (
    <li className="flex mb-4 lg:mb-0 items-center gap-2">
      <ChangelogBullet type={props.type} />
      {props.text}
    </li>
  );
}

export default ChangelogListItem;
