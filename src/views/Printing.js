import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  FormInput,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  FormSelect,
} from 'shards-react';
import { getPrintingOrders, updateOrder, fulfillOrder, updateFulfillment } from '../flux/actions';
import store from '../flux/store';
import printingStates from '../config/printing-states';
import PageTitle from '../components/common/PageTitle';
import PrintingBoard from '../components/printing/Board';
import PrintingTable from '../components/printing/Table';
import { displayEnum, sortEnum, pageSize } from '../helpers/printings';
import '../assets/pagination.scss';
import '../assets/board.scss';

export const getBooks = (order) => {
  return order.line_items.map((item) => {
    let newItem = { id: item.id };
    item.properties.forEach((prop) => {
      newItem[prop.name] = prop.value;
    });
    newItem['quantity'] = item.quantity;
    return { ...newItem };
  });
};

const Printing = () => {
  const [display, setDisplay] = useState(displayEnum.BOARD);
  // const [me, setMe] = useState(store.getMe());
  const [orders, setOrders] = useState(store.getPrintingOrders());
  const [uiState, setUiState] = useState({
    isEdit: false,
    modal: false,
    modalData: [],
    receiptModal: false,
    orderId: '',
    loading: true,
    updating: '',
  });
  const [filterState, setFilterState] = useState({
    filteredStatus: '',
    filteredOrderNumber: '',
    sortByColumn: '',
    sortByDescending: true,
  });
  const [fulfillmentData, setFulfillmentData] = useState({
    id: '',
    tracking_number: '',
    tracking_company: '',
    orderId: '',
  });
  useEffect(() => {
    store.addChangeListener(onChange);
    if (store.getPrintingOrders().length === 0) getPrintingOrders();
    return () => store.removeChangeListener(onChange);
  }, []);
  useEffect(() => {
    const { filteredStatus, filteredOrderNumber, sortByColumn, sortByDescending } = filterState;
    let filteredOrders = [...store.getPrintingOrders()];
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
    // console.log(filteredOrders.map((ord) => ord.printings.created_at));
    setOrders(filteredOrders);
  }, [filterState]);
  function onChange() {
    setOrders(store.getPrintingOrders());
    setUiState({ ...uiState, loading: false, updating: false });
    // setMe(store.getMe());
  }
  useEffect(() => {
    setFilterState({ filteredStatus: '', filteredOrderNumber: '', sortByColumn: '', sortByDescending: true });
  }, [display]);
  const viewBooks = (order) => {
    setUiState({ ...uiState, modal: true, modalData: getBooks(order) });
  };
  const toggleSort = (type) => {
    if (filterState.sortByColumn === type) {
      setFilterState({ ...filterState, sortByDescending: !filterState.sortByDescending });
    } else {
      setFilterState({ ...filterState, sortByColumn: type, sortByDescending: true });
    }
  };
  const onFulfillOrder = () => {
    setUiState({ ...uiState, loading: true });
    const { tracking_number, trackin_url, tracking_company } = fulfillmentData;
    fulfillOrder(uiState.orderId, { tracking_number, trackin_url, tracking_company });
    closeReceiptModal();
  };
  const onUpdateFulfillment = () => {
    setUiState({ ...uiState, loading: true });
    const { id, tracking_number, tracking_company } = fulfillmentData;
    updateFulfillment(uiState.orderId, id, { id, tracking_number, tracking_company });
    closeReceiptModal();
  };
  const viewFulfillment = (order) => {
    const [fulfillment] = order.fulfillments;
    if (fulfillment) {
      const { id, tracking_number, tracking_company } = fulfillment;
      setFulfillmentData({ id, tracking_number, tracking_company });
    } else {
      setFulfillmentData({ id: '', tracking_number: '', tracking_company: '' });
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
  const paginationSize = useMemo(() => {
    if (display === displayEnum.BOARD) return 0;
    return Math.ceil(orders.length / pageSize);
  }, [orders, display]);

  const onDragEnd = useCallback(
    ({ destination, draggableId, source }) => {
      if (display === displayEnum.TABLE) return;
      if (!destination) return;
      if (destination.droppableId == source.droppableId) return;
      // eslint-disable-next-line
      if (destination.droppableId == 'DONE' && !confirm('Are you sure to move this order to "done"?')) return;

      setUiState({ ...uiState, loading: false, updating: destination.droppableId });
      const newState = printingStates.find((state) => state.key === destination.droppableId);
      const newOrders = orders.map((order) => {
        if (order.id == draggableId) order.printings.printing_state = newState.key;
        return order;
      });
      // console.log(orders)
      setOrders(newOrders);
      updateOrder(draggableId, { status: newState.key });
    },
    [orders, display],
  );

  const sortBy = (isDescending) => {
    const sortByDescending = isDescending === 'Descending';
    setFilterState({ ...filterState, sortByColumn: sortEnum.DAYS_LEFT, sortByDescending });
  };

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Daftar Print" subtitle="Pesanan yang siap untuk diprint" className="text-sm-left" />
      </Row>

      <Row>
        <Col sm="3">
          <FormGroup>
            <label htmlFor="layoutSelect" style={{ fontWeight: 500 }}>
              Layout
            </label>
            <FormSelect id="layoutSelect" defaultValue={display} onChange={(e) => setDisplay(e.target.value)} size="sm">
              {Object.keys(displayEnum).map((displayKey) => (
                <option key={displayKey} value={displayEnum[displayKey]}>
                  {displayEnum[displayKey]}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
        </Col>
        <Col sm="3">
          <FormGroup>
            <label htmlFor="filterOrderNumber" style={{ fontWeight: 500 }}>
              Search Order Number
            </label>
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
            {display === displayEnum.TABLE ? (
              <>
                <label htmlFor="filterStatus" style={{ fontWeight: 500 }}>
                  Filter State
                </label>
                <FormSelect
                  id="filterStatus"
                  defaultValue={filterState.filteredStatus}
                  onChange={(e) => setFilterState({ ...filterState, filteredStatus: e.target.value })}
                  size="sm"
                >
                  <option value="">Select status</option>
                  {printingStates.map((state) => (
                    <option key={state.key} value={state.key}>
                      {state.value}
                    </option>
                  ))}
                </FormSelect>
              </>
            ) : (
              <>
                <label htmlFor="sortBy" style={{ fontWeight: 500 }}>
                  Sort Days
                </label>
                <FormSelect id="sortBy" onChange={(e) => sortBy(e.target.value)} size="sm">
                  <option value="">Select sort</option>
                  {['Descending', 'Ascending'].map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </FormSelect>
              </>
            )}
          </FormGroup>
        </Col>
      </Row>

      {/* Default Light Table */}
      {display === displayEnum.TABLE && (
        <PrintingTable
          toggleSort={toggleSort}
          filterState={filterState}
          pageActive={pageActive}
          display={display}
          uiState={uiState}
          orders={orders}
          setUiState={setUiState}
          viewFulfillment={viewFulfillment}
          viewBooks={viewBooks}
        />
      )}
      {display === displayEnum.BOARD && (
        <PrintingBoard
          onDragEnd={onDragEnd}
          uiState={uiState}
          orders={orders}
          viewFulfillment={viewFulfillment}
          viewBooks={viewBooks}
        />
      )}

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
                    Umur
                  </th>
                  <th scope="col" className="border-0">
                    Rambut
                  </th>
                  <th scope="col" className="border-0">
                    Kulit
                  </th>
                  <th scope="col" className="border-0">
                    Bahasa
                  </th>
                  <th scope="col" className="border-0">
                    Profesi
                  </th>
                  <th scope="col" className="border-0">
                    Cover
                  </th>
                  <th scope="col" className="border-0">
                    Nama
                  </th>
                  <th scope="col" className="border-0">
                    Jenis Kelamin
                  </th>
                  <th scope="col" className="border-0">
                    Ayah
                  </th>
                  <th scope="col" className="border-0">
                    Ibu
                  </th>
                  <th scope="col" className="border-0">
                    Jumlah
                  </th>
                  <th scope="col" className="border-0">
                    Dedication
                  </th>
                </tr>
              </thead>
              <tbody>
                {uiState.modalData.map((data) => (
                  <tr key={data.id}>
                    <td style={{ textTransform: 'capitalize' }}>{data.Age}</td>
                    <td style={{ textTransform: 'capitalize' }}>{data.Hair}</td>
                    <td style={{ textTransform: 'capitalize' }}>{data.Skin}</td>
                    <td style={{ textTransform: 'capitalize' }}>{data.Language}</td>
                    <td style={{ textTransform: 'capitalize' }}>{data.Occupations}</td>
                    <td style={{ textTransform: 'capitalize' }}>{data.Cover}</td>
                    <td style={{ textTransform: 'capitalize' }}>{data.Name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{data.Gender}</td>
                    <td style={{ textTransform: 'capitalize' }}>{data.Daddy}</td>
                    <td style={{ textTransform: 'capitalize' }}>{data.Mommy}</td>
                    <td>{data.quantity}</td>
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
