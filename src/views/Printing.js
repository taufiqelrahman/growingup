import React, { useEffect, useState, Fragment } from 'react';
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
import { getOrders, updateOrder } from '../flux/actions';
import store from '../flux/store';
import printingStates from '../config/printing-states';
import PageTitle from '../components/common/PageTitle';

const Printing = () => {
  const [orders, setOrders] = useState(store.getOrders());
  const [uiState, setUiState] = useState({
    isEdit: false,
    modal: false,
    modalData: [],
  });
  const [formData, setFormData] = useState({
    status: '',
    path: '',
  });
  useEffect(() => {
    store.addChangeListener(onChange);
    if (store.getOrders().length === 0) getOrders();
    return () => store.removeChangeListener(onChange);
  }, []);
  function onChange() {
    // console.log(store.getOrders());
    setOrders(store.getOrders());
  }
  const calculateDays = (paid_date) => {
    const paidDate = new Date(paid_date);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - paidDate);
    return 7 - Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
            <CardHeader className="border-bottom">Filter</CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0" width="15%">
                      Nomor Order
                    </th>
                    <th scope="col" className="border-0" width="20%">
                      Status
                    </th>
                    <th scope="col" className="border-0" width="9%">
                      Sisa Hari
                    </th>
                    <th scope="col" className="border-0" width={uiState.isEdit ? '25%' : null}>
                      Folder
                    </th>
                    <th scope="col" className="border-0">
                      Alamat
                    </th>
                    <th scope="col" className="border-0" width="20%">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
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
                        ) : (
                          <a href={order.printings.source_path} target="_blank" rel="noreferrer">
                            <i className="material-icons">folder_open</i>
                          </a>
                        )}
                      </td>
                      {order.shipping_address && (
                        <td>
                          <div>{order.shipping_address.name}</div>
                          <div>{order.shipping_address.phone}</div>
                          <div>{order.shipping_address.address1}</div>
                          {order.shipping_address.address2 && <div>{order.shipping_address.address2}</div>}
                          <div>
                            {order.shipping_address.city}&nbsp;
                            {order.shipping_address.province}&nbsp;
                            {order.shipping_address.zip}
                          </div>
                        </td>
                      )}
                      {/* <td>
                        {isEdit === order.id ? (
                          <FormGroup>
                            <FormInput
                              id="inputPhone"
                              placeholder="Phone"
                              defaultValue={order.phone}
                              onChange={onTextChange}
                              size="sm"
                              type="number"
                            />
                          </FormGroup>
                        ) : (
                          order.phone
                        )}
                        </td> */}
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
                            <Button
                              outline
                              size="sm"
                              theme="warning"
                              className="mb-2 mr-1"
                              onClick={() => onEdit(order)}
                            >
                              Ubah
                            </Button>
                            <Button outline size="sm" className="mb-2 mr-1" onClick={() => viewBooks(order)}>
                              Lihat Buku
                            </Button>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </ModalBody>
        )}
      </Modal>
    </Container>
  );
};

export default Printing;
