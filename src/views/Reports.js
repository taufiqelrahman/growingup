import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'shards-react';

import { CSVLink } from 'react-csv';
import { getOrders } from '../flux/actions';
import store from '../flux/store';
import PageTitle from '../components/common/PageTitle';
// import OrderReport from '../components/reports/orders';

const Reports = () => {
  const [orders, setOrders] = useState(store.getOrders());
  useEffect(() => {
    store.addChangeListener(onChange);
    if (store.getOrders().length === 0) getOrders();
    return () => store.removeChangeListener(onChange);
  }, []);
  function onChange() {
    setOrders(store.getOrders());
  }
  const headers = [
    { label: 'Created At', key: 'created_at' },
    { label: 'Order Number', key: 'order_number' },
    { label: 'Payment Gateway', key: 'gateway' },
    { label: 'Financial Status', key: 'financial_status' },
    { label: 'Total Discounts', key: 'total_discounts' },
    { label: 'Total Items Price', key: 'total_line_items_price' },
    { label: 'Fulfillment Status', key: 'fulfillment_status' },
    { label: 'Total Price', key: 'total_price' },
    { label: 'Total Books', key: 'total_line_items' },
  ];
  const filteredOrders = () => {
    return orders.map(
      ({
        created_at,
        gateway,
        financial_status,
        total_discounts,
        total_line_items_price,
        order_number,
        fulfillment_status,
        total_price,
        line_items,
      }) => ({
        created_at,
        gateway,
        financial_status,
        total_discounts,
        total_line_items_price,
        order_number,
        fulfillment_status,
        total_price,
        total_line_items: line_items.length,
      }),
    );
  };
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Download Reports" subtitle="Unduh report yang kau butuhkan" className="text-sm-left" />
      </Row>
      <Row>
        <Col sm="3">
          <Button theme="success" disabled={orders.length === 0}>
            {orders.length ? (
              <CSVLink data={filteredOrders()} headers={headers} filename="test" style={{ color: 'white' }}>
                Orders
              </CSVLink>
            ) : (
              'Orders'
            )}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
