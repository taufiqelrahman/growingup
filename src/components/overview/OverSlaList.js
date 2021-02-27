import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem } from 'shards-react';

const TopReferrals = ({ title, books }) => {
  return (
    <Card small>
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
        <div className="block-handle" />
      </CardHeader>
      {books.slaByDays.length ? (
        <CardHeader className="d-flex px-3 border-bottom">
          <span style={{ fontWeight: 600 }} className="text-fiord-blue">
            Days passed
          </span>
          <span style={{ fontWeight: 600 }} className="ml-auto text-right text-reagent-gray">
            Count
          </span>
        </CardHeader>
      ) : null}

      <CardBody className="p-0" style={{ height: 362, overflowY: 'auto' }}>
        <ListGroup small flush className="list-group-small">
          {books.slaByDays.length ? (
            books.slaByDays.map((book) => (
              <ListGroupItem key={book.day} className="d-flex px-3">
                <span className="text-semibold text-fiord-blue">{book.day}</span>
                <span className="ml-auto text-right text-semibold text-reagent-gray">{book.count}</span>
              </ListGroupItem>
            ))
          ) : (
            <ListGroupItem className="d-flex px-3">Data not available</ListGroupItem>
          )}
        </ListGroup>
      </CardBody>

      {/* <CardFooter className="border-top">
      <Row>
        <Col>
          <FormSelect size="sm" value="last-week" style={{ maxWidth: '130px' }} onChange={() => {}}>
            <option value="last-week">Last Week</option>
            <option value="today">Today</option>
            <option value="last-month">Last Month</option>
            <option value="last-year">Last Year</option>
          </FormSelect>
        </Col>

        <Col className="text-right view-report">
          <a href="#">Full report &rarr;</a>
        </Col>
      </Row>
    </CardFooter> */}
    </Card>
  );
};

TopReferrals.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The referral data.
   */
  // referralData: PropTypes.array,
  books: PropTypes.object,
};

TopReferrals.defaultProps = {
  title: 'Over Sla By Days',
  // referralData: [
  //   {
  //     title: 'GitHub',
  //     value: '19,291',
  //   },
  //   {
  //     title: 'Stack Overflow',
  //     value: '11,201',
  //   },
  //   {
  //     title: 'Hacker News',
  //     value: '9,291',
  //   },
  //   {
  //     title: 'Reddit',
  //     value: '8,281',
  //   },
  //   {
  //     title: 'The Next Web',
  //     value: '7,128',
  //   },
  //   {
  //     title: 'Tech Crunch',
  //     value: '6,218',
  //   },
  //   {
  //     title: 'YouTube',
  //     value: '1,218',
  //   },
  //   {
  //     title: 'Adobe',
  //     value: '1,171',
  //   },
  // ],
};

export default TopReferrals;
