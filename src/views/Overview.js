import React, { useMemo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Container, Row, Col, FormGroup, FormSelect } from 'shards-react';
import styled from 'styled-components';

import PageTitle from '../components/common/PageTitle';
import OverSlaByStates from '../components/overview/OverSlaByStates';
import OverSlaList from '../components/overview/OverSlaList';
// import SmallStats from '../components/common/SmallStats';
// import UsersOverview from '../components/blog/UsersOverview';
// import NewDraft from '../components/blog/NewDraft';
// import Discussions from '../components/blog/Discussions';

import { getOrders } from '../flux/actions';
import store from '../flux/store';
import {
  booksSold,
  ordersProcessed,
  uniqueCustomers,
  timeUnitEnum,
  timeSpaceEnum,
  returnedBooks,
  booksOverSla,
} from '../helpers/overview';

const StatsWrapperEl = styled.div`
  min-height: 8.7rem;
  box-shadow: 0 2px 0 rgba(90, 97, 105, 0.11), 0 4px 8px rgba(90, 97, 105, 0.12), 0 10px 10px rgba(90, 97, 105, 0.06),
    0 7px 70px rgba(90, 97, 105, 0.1);
  background-color: ${({ background }) => background || '#fff'};
  border-radius: 0.625rem;
  display: flex;
  flex-direction: column;
`;

const StatsContentEl = styled.div`
  margin: auto;
`;
const StatsTitleEl = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.0625rem;
  color: #818ea3;
  text-transform: uppercase;
`;
const StatsValueEl = styled.div`
  height: 51px;
`;
const StatsNumberEl = styled.h6`
  font-size: 2.0625rem;
  margin-bottom: 8px;
  margin-top: 16px;
  line-height: 1.5rem;
  color: #3d5170;
  font-weight: 500;
  text-align: center;
`;
const StatsSubtitleEl = styled.div`
  text-align: center;
  margin-bottom: 8px;
  color: #818ea3;
`;

const Overview = () => {
  const [timeFilter, setTimeFilter] = useState({
    unit: timeUnitEnum.MONTHLY,
    space: timeSpaceEnum.Monthly[0],
  });

  const [orders, setOrders] = useState(store.getOrders());
  const [printings, setPrintings] = useState(store.getPrintings());
  useEffect(() => {
    store.addChangeListener(onChange);
    if (store.getOrders().length === 0 || store.getPrintings().length === 0) getOrders();
    return () => store.removeChangeListener(onChange);
  }, []);
  function onChange() {
    setOrders(store.getOrders());
    setPrintings(store.getPrintings());
  }

  const stats = useMemo(() => {
    const booksSoldResult = booksSold(orders, timeFilter);
    const ordersProcessedResult = ordersProcessed(orders, timeFilter);
    const uniqueCustomersResult = uniqueCustomers(orders, timeFilter);
    const returnedBooksResult = returnedBooks(printings, timeFilter);
    return [booksSoldResult, ordersProcessedResult, uniqueCustomersResult, returnedBooksResult];
  }, [timeFilter, orders, printings]);
  const overSlaBooks = useMemo(() => {
    return booksOverSla(orders, timeFilter);
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
        <>
          <Row>
            {stats.map((stats, idx) => (
              <Col className="mb-4" key={idx} {...stats.attrs}>
                <StatsWrapperEl background={stats.backgroundColor}>
                  <StatsContentEl>
                    <StatsTitleEl>{stats.label}</StatsTitleEl>
                    <StatsValueEl>
                      <StatsNumberEl>{stats.value}</StatsNumberEl>
                      <StatsSubtitleEl>{stats.subtitle}</StatsSubtitleEl>
                    </StatsValueEl>
                  </StatsContentEl>
                </StatsWrapperEl>
              </Col>
            ))}
          </Row>
          <Row>
            <Col lg="6" md="6" sm="12" className="mb-4">
              <OverSlaByStates books={overSlaBooks} />
            </Col>
            <Col lg="3" md="3" sm="12" className="mb-4">
              <OverSlaList books={overSlaBooks} timeFilter={timeFilter} />
            </Col>
          </Row>
        </>
      ) : (
        'loading...'
      )}

      {/* <Row>
        <Col lg="8" md="12" sm="12" className="mb-4">
          <UsersOverview />
        </Col>

        <Col lg="4" md="6" sm="12" className="mb-4">
          <NewDraft />
        </Col>

        <Col lg="5" md="12" sm="12" className="mb-4">
          <Discussions />
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
