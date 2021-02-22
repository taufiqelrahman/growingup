import React, { useMemo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Container, Row, Col, FormGroup, FormSelect } from 'shards-react';

import PageTitle from '../components/common/PageTitle';
import SmallStats from '../components/common/SmallStats';
// import UsersOverview from '../components/blog/UsersOverview';
// import UsersByDevice from '../components/blog/UsersByDevice';
// import NewDraft from '../components/blog/NewDraft';
// import Discussions from '../components/blog/Discussions';
// import TopReferrals from '../components/common/TopReferrals';

import { getOrders } from '../flux/actions';
import store from '../flux/store';
import {
  booksSold,
  ordersProcessed,
  uniqueCustomers,
  timeUnitEnum,
  timeSpaceEnum,
  returnedBooks,
} from '../helpers/overview';

const Overview = () => {
  const [timeFilter, setTimeFilter] = useState({
    unit: timeUnitEnum.MONTHLY,
    space: timeSpaceEnum.Monthly[0],
  });

  const [orders, setOrders] = useState(store.getOrders());
  useEffect(() => {
    store.addChangeListener(onChange);
    if (store.getOrders().length === 0) getOrders();
    return () => store.removeChangeListener(onChange);
  }, []);
  function onChange() {
    setOrders(store.getOrders());
  }

  const stats = useMemo(() => {
    const booksSoldResult = booksSold(orders, timeFilter);
    const ordersProcessedResult = ordersProcessed(orders, timeFilter);
    const uniqueCustomersResult = uniqueCustomers(orders, timeFilter);
    const returnedBooksResult = returnedBooks(orders, timeFilter);
    return [booksSoldResult, ordersProcessedResult, uniqueCustomersResult, returnedBooksResult];
  }, [timeFilter, orders]);
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle title="Overview" subtitle="Dashboard" className="text-sm-left mb-3" />
      </Row>

      <Row>
        <Col sm="3">
          <FormGroup>
            <FormSelect
              defaultValue={timeFilter.unit}
              onChange={(e) =>
                setTimeFilter({
                  unit: e.target.value,
                  space: timeSpaceEnum[e.target.value][0],
                })
              }
              size="sm"
            >
              {Object.keys(timeUnitEnum).map((unitKey) => (
                <option key={unitKey} value={timeUnitEnum[unitKey]}>
                  {timeUnitEnum[unitKey]}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <FormSelect
              defaultValue={timeFilter.space}
              onChange={(e) => setTimeFilter({ ...timeFilter, space: e.target.value })}
              size="sm"
            >
              {timeSpaceEnum[timeFilter.unit].map((spaceKey) => (
                <option key={spaceKey} value={spaceKey}>
                  {spaceKey}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
        </Col>
      </Row>

      {orders.length ? (
        <Row>
          {stats.map((stats, idx) => (
            <Col className="mb-4" key={idx} {...stats.attrs}>
              <SmallStats
                id={`small-stats-${idx}`}
                variation="1"
                chartData={stats.datasets}
                chartLabels={stats.chartLabels}
                label={stats.label}
                value={stats.value}
                percentage={stats.percentage}
                increase={stats.increase}
                decrease={stats.decrease}
              />
            </Col>
          ))}
        </Row>
      ) : (
        'loading...'
      )}

      {/* <Row>
        <Col lg="8" md="12" sm="12" className="mb-4">
          <UsersOverview />
        </Col>

        <Col lg="4" md="6" sm="12" className="mb-4">
          <UsersByDevice />
        </Col>

        <Col lg="4" md="6" sm="12" className="mb-4">
          <NewDraft />
        </Col>

        <Col lg="5" md="12" sm="12" className="mb-4">
          <Discussions />
        </Col>

        <Col lg="3" md="12" sm="12" className="mb-4">
          <TopReferrals />
        </Col>
      </Row> */}
    </Container>
  );
};
// Overview.propTypes = {
//   /**
//    * The small stats dataset.
//    */
//   smallStats: PropTypes.array,
// };

// Overview.defaultProps = {
//   smallStats: [
//     {
//       label: 'Books Sold',
//       value: '2,390',
//       // percentage: '4.7%',
//       // increase: true,
//       chartLabels: [null, null, null, null, null, null, null],
//       attrs: { md: '6', sm: '6' },
//       datasets: [
//         {
//           label: 'Today',
//           fill: 'start',
//           borderWidth: 1.5,
//           backgroundColor: 'rgba(0, 184, 216, 0.1)',
//           borderColor: 'rgb(0, 184, 216)',
//           data: [1, 2, 1, 3, 5, 4, 7],
//         },
//       ],
//     },
//     {
//       label: 'Orders processed',
//       value: '182',
//       // percentage: '12.4',
//       // increase: true,
//       chartLabels: [null, null, null, null, null, null, null],
//       attrs: { md: '6', sm: '6' },
//       datasets: [
//         {
//           label: 'Today',
//           fill: 'start',
//           borderWidth: 1.5,
//           backgroundColor: 'rgba(23,198,113,0.1)',
//           borderColor: 'rgb(23,198,113)',
//           data: [1, 2, 3, 3, 3, 4, 4],
//         },
//       ],
//     },
//     {
//       label: 'Unique customers',
//       value: '8,147',
//       // percentage: '3.8%',
//       // increase: false,
//       // decrease: true,
//       chartLabels: [null, null, null, null, null, null, null],
//       attrs: { md: '6', sm: '6' },
//       datasets: [
//         {
//           label: 'Today',
//           fill: 'start',
//           borderWidth: 1.5,
//           backgroundColor: 'rgba(255,180,0,0.1)',
//           borderColor: 'rgb(255,180,0)',
//           data: [2, 3, 3, 3, 4, 3, 3],
//         },
//       ],
//     },
//     {
//       label: 'Returned books',
//       value: '29',
//       // percentage: '2.71%',
//       // increase: false,
//       // decrease: true,
//       chartLabels: [null, null, null, null, null, null, null],
//       attrs: { md: '6', sm: '6' },
//       datasets: [
//         {
//           label: 'Today',
//           fill: 'start',
//           borderWidth: 1.5,
//           backgroundColor: 'rgba(255,65,105,0.1)',
//           borderColor: 'rgb(255,65,105)',
//           data: [1, 7, 1, 3, 1, 4, 8],
//         },
//       ],
//     },
//     // {
//     //   label: 'Subscribers',
//     //   value: '17,281',
//     //   percentage: '2.4%',
//     //   increase: false,
//     //   decrease: true,
//     //   chartLabels: [null, null, null, null, null, null, null],
//     //   attrs: { md: '4', sm: '6' },
//     //   datasets: [
//     //     {
//     //       label: 'Today',
//     //       fill: 'start',
//     //       borderWidth: 1.5,
//     //       backgroundColor: 'rgb(0,123,255,0.1)',
//     //       borderColor: 'rgb(0,123,255)',
//     //       data: [3, 2, 3, 2, 4, 5, 4],
//     //     },
//     //   ],
//     // },
//   ],
// };

export default Overview;
