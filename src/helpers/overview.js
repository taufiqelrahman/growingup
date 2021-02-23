export const timeUnitEnum = {
  DAILY: 'Daily',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
};
export const timeSpaceEnum = {
  Daily: ['Today', 'Yesterday'],
  Monthly: ['This month', 'Last month'],
  Yearly: ['This year', 'Last year'],
};

const dateConverter = (date, timeFilter, reductor = 0) => {
  const [month, day, year] = date.toLocaleDateString().split('/');
  switch (timeFilter.unit) {
    case timeUnitEnum.DAILY:
      return parseInt(day, 10) - reductor + month + year;
    case timeUnitEnum.MONTHLY:
      return parseInt(month, 10) - reductor + year;
    case timeUnitEnum.YEARLY:
      return parseInt(year, 10) - reductor;
  }
};

const filterOrders = (orders, timeFilter) => {
  const reductor = timeSpaceEnum[timeFilter.unit].indexOf(timeFilter.space) === 0 ? 0 : 1;
  const dateComparer = dateConverter(new Date(), timeFilter, reductor);
  return orders.filter((order) => {
    const dateToCompare = dateConverter(new Date(order.created_at), timeFilter);
    return dateToCompare === dateComparer;
  });
};
// const getRandomInt = (max) => {
//   return Math.floor(Math.random() * max);
// };
// const chartMock = {
//   chartLabels: [null, null, null, null, null, null, null, null, null, null],
//   data: [
//     getRandomInt(20),
//     getRandomInt(20),
//     getRandomInt(20),
//     getRandomInt(20),
//     getRandomInt(20),
//     getRandomInt(20),
//     getRandomInt(20),
//     getRandomInt(20),
//     getRandomInt(20),
//     getRandomInt(20),
//   ],
// };

export const booksSold = (orders, timeFilter) => {
  const filteredOrders = filterOrders(orders, timeFilter);
  const count = filteredOrders.reduce((acc, curr) => acc + curr.line_items.length, 0);
  return {
    label: 'Books Sold',
    value: count,
    backgroundColor: 'rgba(0, 184, 216, 0.1)',
    attrs: { md: '6', sm: '6' },
    // chartLabels: chartMock.chartLabels,
    // datasets: [
    //   {
    //     label: timeFilter.space,
    //     fill: 'start',
    //     borderWidth: 1.5,
    //     borderColor: 'rgb(0, 184, 216)',
    //     data: chartMock.data,
    //   },
    // ],
  };
};

export const ordersProcessed = (orders, timeFilter) => {
  const filteredOrders = filterOrders(orders, timeFilter);
  return {
    label: 'Orders processed',
    value: filteredOrders.length,
    backgroundColor: 'rgba(23,198,113,0.1)',
    attrs: { md: '6', sm: '6' },
    // chartLabels: chartMock.chartLabels,
    // datasets: [
    //   {
    //     label: timeFilter.space,
    //     fill: 'start',
    //     borderWidth: 1.5,
    //     borderColor: 'rgb(23,198,113)',
    //     data: chartMock.data,
    //   },
    // ],
  };
};

export const uniqueCustomers = (orders, timeFilter) => {
  const filteredOrders = filterOrders(orders, timeFilter);
  const customers = new Set(filteredOrders.map((order) => order.email));
  return {
    label: 'Unique customers',
    value: customers.size,
    backgroundColor: 'rgba(255,180,0,0.1)',
    attrs: { md: '6', sm: '6' },
    // chartLabels: chartMock.chartLabels,
    // datasets: [
    //   {
    //     label: timeFilter.space,
    //     fill: 'start',
    //     borderWidth: 1.5,
    //     borderColor: 'rgb(255,180,0)',
    //     data: chartMock.data,
    //   },
    // ],
  };
};

export const returnedBooks = (orders, timeFilter) => {
  const filteredOrders = filterOrders(orders, timeFilter);
  const refundsCount = filteredOrders.reduce((acc, order) => acc + order.refunds.length, 0);
  return {
    label: 'Returned books',
    value: refundsCount,
    backgroundColor: 'rgba(255,65,105,0.1)',
    attrs: { md: '6', sm: '6' },
    // chartLabels: chartMock.chartLabels,
    // datasets: [
    //   {
    //     label: timeFilter.space,
    //     fill: 'start',
    //     borderWidth: 1.5,
    //     borderColor: 'rgb(255,65,105)',
    //     data: chartMock.data,
    //   },
    // ],
  };
};
