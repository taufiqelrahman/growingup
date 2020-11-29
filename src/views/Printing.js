import React, { useEffect, useState, Fragment, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  FormInput,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  FormSelect,
} from 'shards-react';
import { getOrders, updateOrder, fulfillOrder, updateFulfillment } from '../flux/actions';
import store from '../flux/store';
import printingStates from '../config/printing-states';
import PageTitle from '../components/common/PageTitle';
import '../assets/pagination.scss';

const sortEnum = {
  DAYS_LEFT: 'created_at',
  STATUS: 'printing_state',
};
const pageSize = 10;

const Printing = () => {
  const [me, setMe] = useState(store.getMe());
  const [orders, setOrders] = useState(store.getOrders());
  const [uiState, setUiState] = useState({
    isEdit: false,
    modal: false,
    modalData: [],
    receiptModal: false,
    orderId: '',
  });
  const [filterState, setFilterState] = useState({
    filteredStatus: '',
    filteredOrderNumber: '',
    sortByColumn: '',
    sortByDescending: true,
  });
  const [formData, setFormData] = useState({
    status: '',
    path: '',
  });
  const [fulfillmentData, setFulfillmentData] = useState({
    id: '',
    tracking_number: '',
    tracking_company: '',
    orderId: '',
  });
  useEffect(() => {
    store.addChangeListener(onChange);
    if (store.getOrders().length === 0) getOrders();
    return () => store.removeChangeListener(onChange);
  }, []);
  useEffect(() => {
    const { filteredStatus, filteredOrderNumber, sortByColumn, sortByDescending } = filterState;
    let filteredOrders = [...store.getOrders()];
    if (filteredStatus || filteredOrderNumber) {
      filteredOrders = filteredOrders.filter((order) => {
        let eligible = false;
        if (filteredStatus) eligible = order.printings.printing_state === filteredStatus;
        if (filteredOrderNumber) eligible = order.order_number.includes(filteredOrderNumber);
        return eligible;
      });
    }
    if (sortByColumn) {
      filteredOrders = filteredOrders.sort((a, b) => {
        if (sortByColumn === sortEnum.DAYS_LEFT) {
          if (sortByDescending) return new Date(b.printings[sortByColumn]) - new Date(a.printings[sortByColumn]);
          return new Date(a.printings[sortByColumn]) - new Date(b.printings[sortByColumn]);
        } else {
          if (a.printings[sortByColumn] < b.printings[sortByColumn]) return sortByDescending ? 1 : -1;
          if (a.printings[sortByColumn] > b.printings[sortByColumn]) return sortByDescending ? -1 : 1;
          return 0;
        }
      });
    }
    // console.log(filteredOrders.map((ord) => ord.id));
    setOrders(filteredOrders);
  }, [filterState]);
  function onChange() {
    setOrders(store.getOrders());
    setMe(store.getMe());
  }
  const calculateDays = (paid_date) => {
    const paidDate = new Date(paid_date);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - paidDate);
    const days = 7 - Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const previewNames = (order) => {
    if (!order.line_items) return '-';
    const names = order.line_items.map((item) => {
      const { value: name } = item.properties.find((prop) => prop.name === 'Name');
      return name;
    });
    return names.join(', ');
  };

  const onEdit = (order) => {
    setUiState({ ...uiState, isEdit: order.id });
    setFormData({
      status: order.printings.printing_state,
      path: order.printings.source_path,
    });
  };
  const viewBooks = (order) => {
    const books = order.line_items.map((item) => {
      let newItem = { id: item.id };
      item.properties.forEach((prop) => {
        newItem[prop.name] = prop.value;
      });
      return { ...newItem };
    });
    setUiState({ ...uiState, modal: true, modalData: books });
  };
  const cancelEdit = () => {
    setUiState({ ...uiState, isEdit: false });
  };
  const onSave = (order) => {
    updateOrder(order.id, formData);
    cancelEdit();
  };
  const toggleSort = (type) => {
    if (filterState.sortByColumn === type) {
      setFilterState({ ...filterState, sortByDescending: !filterState.sortByDescending });
    } else {
      setFilterState({ ...filterState, sortByColumn: type, sortByDescending: true });
    }
  };
  const onFulfillOrder = () => {
    const { tracking_number, trackin_url, tracking_company } = fulfillmentData;
    fulfillOrder(uiState.orderId, { tracking_number, trackin_url, tracking_company });
    closeReceiptModal();
  };
  const onUpdateFulfillment = () => {
    const { id, tracking_number, tracking_company } = fulfillmentData;
    updateFulfillment(uiState.orderId, id, { id, tracking_number, tracking_company });
    closeReceiptModal();
  };
  const viewFulfillment = (order) => {
    const [fulfillment] = order.fulfillments;
    if (fulfillment) {
      const { id, tracking_number, tracking_company } = fulfillment;
      setFulfillmentData({ id, tracking_number, tracking_company });
    }
    setUiState({ ...uiState, receiptModal: true, orderId: order.shopify_order_id });
  };
  const closeReceiptModal = () => {
    setUiState({ ...uiState, receiptModal: false, orderId: '' });
    setFulfillmentData({
      id: '',
      tracking_number: '',
      tracking_company: '',
    });
  };

  const [pageActive, setPageActive] = useState(0);
  const paginatedOrders = useMemo(() => {
    const pageStart = pageActive * pageSize;
    return orders.slice(pageStart, pageStart + pageSize);
  }, [orders, pageActive]);
  const paginationSize = useMemo(() => {
    return Math.ceil(orders.length / pageSize);
  }, [orders]);

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Daftar Print" subtitle="Pesanan yang siap untuk diprint" className="text-sm-left" />
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h5>Filter</h5>
              <Row>
                <Col sm="3">
                  <FormGroup>
                    <FormInput
                      id="filterOrderNumber"
                      placeholder="Order Number"
                      defaultValue={filterState.filteredOrderNumber}
                      onChange={(e) => setFilterState({ ...filterState, filteredOrderNumber: e.target.value })}
                      size="sm"
                    />
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <FormSelect
                      id="filterStatus"
                      defaultValue={filterState.filteredStatus}
                      onChange={(e) => setFilterState({ ...filterState, filteredStatus: e.target.value })}
                      size="sm"
                    >
                      <option value="">Select status</option>
                      {printingStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </FormSelect>
                  </FormGroup>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-3" style={{ overflowX: 'auto' }}>
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0" width="15%">
                      Nomor Order
                    </th>
                    <th
                      scope="col"
                      className="border-0"
                      width="20%"
                      onClick={() => toggleSort(sortEnum.STATUS)}
                      style={{ cursor: 'pointer' }}
                    >
                      Status
                      {filterState.sortByColumn === sortEnum.STATUS && (
                        <i className="material-icons">
                          {filterState.sortByDescending ? 'arrow_drop_down' : 'arrow_drop_up'}
                        </i>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="border-0"
                      width="9%"
                      onClick={() => toggleSort(sortEnum.DAYS_LEFT)}
                      style={{ cursor: 'pointer' }}
                    >
                      Sisa Hari
                      {filterState.sortByColumn === sortEnum.DAYS_LEFT && (
                        <i className="material-icons">
                          {filterState.sortByDescending ? 'arrow_drop_down' : 'arrow_drop_up'}
                        </i>
                      )}
                    </th>
                    <th scope="col" className="border-0" width={uiState.isEdit ? '25%' : null}>
                      Folder
                    </th>
                    <th scope="col" className="border-0">
                      Nama
                    </th>
                    <th scope="col" className="border-0">
                      Alamat
                    </th>
                    <th scope="col" className="border-0">
                      Notes
                    </th>
                    <th scope="col" className="border-0" width="15%">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.order_number}</td>
                      <td>
                        {uiState.isEdit === order.id ? (
                          <FormGroup>
                            <FormSelect
                              id="inputStatus"
                              defaultValue={order.printings.printing_state}
                              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                              size="sm"
                            >
                              {printingStates.map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </FormSelect>
                          </FormGroup>
                        ) : (
                          order.printings.printing_state
                        )}
                      </td>
                      <td className="text-center">{calculateDays(order.printings.created_at)}</td>
                      <td className="text-center">
                        {uiState.isEdit === order.id ? (
                          <FormGroup>
                            <FormInput
                              id="inputStatus"
                              placeholder="Folder"
                              defaultValue={order.printings.source_path}
                              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                              size="sm"
                            />
                          </FormGroup>
                        ) : order.printings.source_path ? (
                          <a href={order.printings.source_path} target="_blank" rel="noreferrer">
                            <i className="material-icons">folder_open</i>
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>{previewNames(order)}</td>
                      <td>
                        {order.shipping_address ? (
                          <Fragment>
                            <div>{order.shipping_address.name}</div>
                            <div>{order.shipping_address.phone}</div>
                            <div>{order.shipping_address.address1}</div>
                            {order.shipping_address.address2 && <div>{order.shipping_address.address2}</div>}
                            <div>
                              {order.shipping_address.city}&nbsp;
                              {order.shipping_address.province}&nbsp;
                              {order.shipping_address.zip}
                            </div>
                          </Fragment>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <div dangerouslySetInnerHTML={{ __html: order.printings.note }} />
                      </td>
                      <td>
                        {uiState.isEdit === order.id ? (
                          <Fragment>
                            <Button
                              outline
                              size="sm"
                              theme="success"
                              className="mb-2 mr-1"
                              onClick={() => onSave(order)}
                            >
                              Simpan
                            </Button>
                            <Button outline size="sm" theme="secondary" className="mb-2 mr-1" onClick={cancelEdit}>
                              Batal
                            </Button>
                          </Fragment>
                        ) : (
                          <Fragment>
                            {me && me.is_admin === 1 && (
                              <Fragment>
                                <Button
                                  outline
                                  size="sm"
                                  theme="warning"
                                  className="mb-2 mr-1"
                                  onClick={() => onEdit(order)}
                                >
                                  Ubah
                                </Button>
                                <Button
                                  outline
                                  size="sm"
                                  theme="dark"
                                  className="mb-2 mr-1"
                                  onClick={() => viewFulfillment(order)}
                                >
                                  Resi
                                </Button>
                              </Fragment>
                            )}
                            {order.line_items && (
                              <Button outline size="sm" className="mb-2 mr-1" onClick={() => viewBooks(order)}>
                                Lihat Buku
                              </Button>
                            )}
                          </Fragment>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {paginationSize > 1 && (
        <div className="c-pagination">
          <div className="c-pagination__container">
            {new Array(paginationSize).fill(null).map((_, index) => (
              <div
                className={`c-pagination__item ${pageActive === index ? 'c-pagination__item--active' : ''}`}
                key={index}
                onClick={() => {
                  if (pageActive !== index) setPageActive(index);
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={uiState.modal} toggle={() => setUiState({ ...uiState, modal: !uiState.modal })} size="lg">
        <ModalHeader>Buku</ModalHeader>
        {uiState.modalData.length && (
          <ModalBody>
            <table className="table mb-0">
              <thead className="bg-light">
                <tr>
                  <th scope="col" className="border-0">
                    Nama
                  </th>
                  <th scope="col" className="border-0">
                    Jenis Kelamin
                  </th>
                  <th scope="col" className="border-0">
                    Umur
                  </th>
                  <th scope="col" className="border-0">
                    Rambut
                  </th>
                  <th scope="col" className="border-0">
                    Kulit
                  </th>
                  <th scope="col" className="border-0">
                    Profesi
                  </th>
                  <th scope="col" className="border-0">
                    Bahasa
                  </th>
                  <th scope="col" className="border-0">
                    Cover
                  </th>
                  <th scope="col" className="border-0">
                    Dedication
                  </th>
                </tr>
              </thead>
              <tbody>
                {uiState.modalData.map((data) => (
                  <tr key={data.id}>
                    <td>{data.Name}</td>
                    <td>{data.Gender}</td>
                    <td>{data.Age}</td>
                    <td>{data.Hair}</td>
                    <td>{data.Skin}</td>
                    <td>{data.Occupations}</td>
                    <td>{data.Language}</td>
                    <td>{data.Cover}</td>
                    <td>{data.Dedication}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ModalBody>
        )}
      </Modal>
      <Modal open={uiState.receiptModal} toggle={() => setUiState({ ...uiState, receiptModal: !uiState.receiptModal })}>
        <ModalHeader>Resi</ModalHeader>
        <ModalBody>
          <FormGroup>
            <label htmlFor="inputTrackingNumber">Nomor Resi</label>
            <FormInput
              id="inputTrackingNumber"
              placeholder="Nomor Resi"
              defaultValue={fulfillmentData.tracking_number}
              onChange={(e) => setFulfillmentData({ ...fulfillmentData, tracking_number: e.target.value })}
              size="sm"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="inputTrackingCompany">Nama Ekspedisi</label>
            <FormInput
              id="inputTrackingCompany"
              placeholder="Nama Ekspedisi"
              defaultValue={fulfillmentData.tracking_company}
              onChange={(e) => setFulfillmentData({ ...fulfillmentData, tracking_company: e.target.value })}
              size="sm"
            />
          </FormGroup>
          <Button
            outline
            size="sm"
            className="mb-2 mr-1"
            onClick={() => (fulfillmentData.id ? onUpdateFulfillment() : onFulfillOrder())}
          >
            Simpan
          </Button>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default Printing;
