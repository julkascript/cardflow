import { Button, Checkbox, Menu, MenuItem } from '@mui/material';
import MarketTable from '../../components/marketTable/MarketTable';
import PageHeader from '../../components/PageHeader';
import CardflowTabs from '../../components/sellListing/CardflowTabs';
import LensIcon from '@mui/icons-material/Lens';

function MyTrades(): JSX.Element {
  return (
    <section className="bg-[#F5F5F5] min-h-[100vh]">
      <CardflowTabs />
      <PageHeader heading="My trades" />
      <div className="flex flex-col lg:items-center overflow-auto">
        <MarketTable
          page={1}
          onPageChange={() => {}}
          count={0}
          className="w-full rounded-md mt-4 lg:w-10/12 text-left"
        >
          <thead>
            <tr className="text-center">
              <th>
                <Checkbox color="info" />
              </th>
              <th>Trade #</th>
              <th>User</th>
              <th>Status</th>
            </tr>
          </thead>
        </MarketTable>
        <div className="text-center bg-white self-center mb-4 mt-4 w-96 border-[#666666] border rounded-md">
          <p className="pt-4">
            {/* <Trans
              t={t}
              i18nKey="manage.actions.selectedItems"
              count={data.filter((d) => d.selected).length}
              components={{ strong: <strong /> }}
            ></Trans> */}
            0 items selected
          </p>
          <div className="flex justify-between p-4">
            <Button className="rounded-md" variant="outlined">
              Accept all
            </Button>
            <Button className="rounded-md" variant="outlined" color="error">
              Reject all
            </Button>
            <Button
              className="font-bold rounded-md flex gap-1 items-center justify-center"
              variant="outlined"
            >
              <LensIcon sx={{ fontSize: 6 }} color="secondary" />
              <LensIcon sx={{ fontSize: 6 }} color="secondary" />
              <LensIcon sx={{ fontSize: 6 }} color="secondary" />
            </Button>
            {/* <Menu open={true}>
              <MenuItem>Accept selected</MenuItem>
              <MenuItem>Reject selected</MenuItem>
            </Menu> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MyTrades;
