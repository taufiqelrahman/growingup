import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'shards-react';

import { CSVLink } from 'react-csv';
import { getOrders, getChildren } from '../flux/actions';
import store from '../flux/store';
import PageTitle from '../components/common/PageTitle';

const Reports = () => {
  const [orders, setOrders] = useState(store.getOrders());
  const [children, setChildren] = useState(store.getChildren());
  useEffect(() => {
    store.addChangeListener(onChange);
    if (store.getOrders().length === 0) getOrders();
    if (store.getChildren().length === 0) getChildren();
    return () => store.removeChangeListener(onChange);
  }, []);
  function onChange() {
    setOrders(store.getOrders());
    setChildren(store.getChildren());
  }
  const ordersHeaders = [
    { label: 'Created At', key: 'created_at' },
    { label: 'Order Number', key: 'order_number' },
    { label: 'Email', key: 'email' },
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
        name,
        fulfillment_status,
        total_price,
        line_items,
        email,
      }) => ({
        created_at,
        gateway,
        financial_status,
        total_discounts,
        total_line_items_price,
        order_number: name,
        fulfillment_status,
        total_price,
        total_line_items: line_items.length,
        email,
      }),
    );
  };
  const childrenHeaders = [
    { label: 'Created At', key: 'created_at' },
    { label: 'Name', key: 'name' },
    { label: 'Cover', key: 'cover' },
    { label: 'Gender', key: 'gender' },
    { label: 'Age', key: 'age' },
    { label: 'Skin', key: 'skin' },
    { label: 'Hair', key: 'hair' },
    { label: 'Book Language', key: 'language' },
    { label: 'Occupations', key: 'occupations' },
  ];
  const filteredChildren = () => {
    return children.map(({ name, cover, gender, age, skin, hair, language, occupations, created_at }) => ({
      name,
      cover,
      gender,
      age,
      skin,
      hair,
      language,
      occupations,
      created_at,
    }));
  };
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Download Reports" subtitle="Unduh report yang kau butuhkan" className="text-sm-left" />
      </Row>
      <Row>
        <Col>
          <Button theme="success" disabled={orders.length === 0} className="mr-2">
            {orders.length ? (
              <CSVLink
                data={filteredOrders()}
                headers={ordersHeaders}
                filename={`Orders_Reports_${new Date().getTime()}`}
                style={{ color: 'white' }}
              >
                Orders
              </CSVLink>
            ) : (
              'Orders'
            )}
          </Button>
          <Button disabled={children.length === 0}>
            {children.length ? (
              <CSVLink
                data={filteredChildren()}
                headers={childrenHeaders}
                filename={`Children_Reports_${new Date().getTime()}`}
                style={{ color: 'white' }}
              >
                Children
              </CSVLink>
            ) : (
              'Children'
            )}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;
