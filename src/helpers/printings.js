import React from 'react';
import { calculateDays as calculateDaysHelper } from './calculateDays';

export const sortEnum = {
  DAYS_LEFT: 'created_at',
  STATUS: 'printing_state',
};
export const displayEnum = {
  TABLE: 'TABLE',
  BOARD: 'BOARD',
};
export const pageSize = 10;

export const calculateDays = (paid_date) => {
  return 7 - calculateDaysHelper(paid_date);
};

export const previewNames = (order) => {
  if (!order.line_items) return '-';
  const names = order.line_items.map((item) => {
    const { value: name } = item.properties.find((prop) => prop.name === 'Name');
    return name;
  });
  return names.join(', ');
};

export const renderAddress = (order) => {
  const { tags, default_address } = order.customer;
  return order.shipping_address ? (
    <div id={`shipping-address-${order.id}`}>
      <div style={{ opacity: 0, height: 0 }}>
        <div>Dari</div>
        <div>{tags.includes('reseller') ? default_address.company : 'Wigubooks'}</div>
        <div>Kepada</div>
      </div>
      <div style={{ textTransform: 'capitalize' }}>
        {order.shipping_address.name} ({previewNames(order)})
      </div>
      <div>{order.shipping_address.phone}</div>
      <div>{order.shipping_address.address1}</div>
      {order.shipping_address.address2 && <div>{order.shipping_address.address2}</div>}
      <div>
        {order.shipping_address.city}&nbsp;
        {order.shipping_address.province}&nbsp;
        {order.shipping_address.zip}
      </div>
    </div>
  ) : (
    '-'
  );
};

export const renderSourcePath = (order) => {
  return order.printings.source_path ? (
    <a href={order.printings.source_path} target="_blank" rel="noreferrer">
      <i className="material-icons">folder_open</i>
    </a>
  ) : (
    '-'
  );
};
