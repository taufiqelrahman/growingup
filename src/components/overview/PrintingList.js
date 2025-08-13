import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, ListGroup, ListGroupItem } from 'shards-react';

const PrintingList = ({ title, printings }) => {
  return (
    <Card small>
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
        <div className="block-handle" />
      </CardHeader>
      {printings.length ? (
        <CardHeader className="d-flex px-3 border-bottom">
          <span style={{ fontWeight: 600 }} className="text-fiord-blue">
            Printing States
          </span>
          <span style={{ fontWeight: 600 }} className="ml-auto text-right text-reagent-gray">
            Count
          </span>
        </CardHeader>
      ) : null}

      <CardBody className="p-0" style={{ height: 362, overflowY: 'auto' }}>
        <ListGroup small flush className="list-group-small">
          {!!printings.length &&
            printings.map((order) => (
              <ListGroupItem key={order.state.key} className="d-flex px-3">
                <span className="text-semibold text-fiord-blue">{order.state.value}</span>
                <span className="ml-auto text-right text-semibold text-reagent-gray">{order.count}</span>
              </ListGroupItem>
            ))}
        </ListGroup>
      </CardBody>
    </Card>
  );
};

PrintingList.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The printings data.
   */
  printings: PropTypes.array,
};

PrintingList.defaultProps = {
  title: 'Printings Count By States',
};

export default PrintingList;
