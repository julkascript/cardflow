import YugiohCardDetailsCell from './YugiohCardDetailsCell';

function YugiohCardDetailsTable(): JSX.Element {
  return (
    <table className="bg-white border-spacing-0 border-separate rounded-lg border-2 w-5/6 lg:w-1/2 h-[300px]">
      <thead>
        <tr className="text-left">
          <th className="pl-8 pr-8 pt-2 pb-2" colSpan={2}>
            Card and market details
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <YugiohCardDetailsCell heading="Set" data="CT12" />
          <YugiohCardDetailsCell heading="Available items" data="448" />
        </tr>
        <tr>
          <YugiohCardDetailsCell heading="Number" data="032" />
          <YugiohCardDetailsCell heading="From" data="$ 3.03" />
        </tr>
        <tr>
          <YugiohCardDetailsCell heading="Rarity" data="Secret Rare" />
          <YugiohCardDetailsCell heading="30-days average price" data="$ 5.14" />
        </tr>
      </tbody>
    </table>
  );
}

export default YugiohCardDetailsTable;
