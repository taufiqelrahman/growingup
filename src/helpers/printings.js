import React from 'react';

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
  let paidDate = new Date(paid_date);
  const currentDate = new Date();
  let numWorkDays = 0;

  while (paidDate <= currentDate) {
    // Skips Sunday and Saturday
    if (paidDate.getDay() !== 0 && paidDate.getDay() !== 6) {
      numWorkDays++;
    }
    paidDate.setDate(paidDate.getDate() + 1);
  }

  // const diffTime = Math.abs(currentDate - paidDate);
  // const days = 7 - Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return 7 - numWorkDays;
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
  return order.shipping_address ? (
    <div id={`shipping-address-${order.id}`}>
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
