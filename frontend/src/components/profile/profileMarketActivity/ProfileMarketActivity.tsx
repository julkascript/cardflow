import MarketActivityTableCell from './MarketActivityTableCell';

function ProfileMarketActivity(): JSX.Element {
  return (
    <section>
      <table className="border-stone-300 bg-white border-spacing-0 border-separate rounded-lg border-2 w-full">
        <thead>
          <tr>
            <th colSpan={2} className="text-center lg:text-left p-4">
              Market activity
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <MarketActivityTableCell heading="Purchases" data={144} />
            <MarketActivityTableCell heading="Sales" data={10_143} />
          </tr>
          <tr>
            <MarketActivityTableCell heading="Lorem ipsum dolor" data={0} />
            <MarketActivityTableCell heading="Sale rating" data="3.9/5" />
          </tr>
          <tr>
            <MarketActivityTableCell heading="Lorem ipsum" data={45} />
            <MarketActivityTableCell heading="Lorem ipsum dolor sit amet" data={123_456} />
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default ProfileMarketActivity;
