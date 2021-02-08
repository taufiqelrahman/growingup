import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, Button, FormInput, FormGroup, FormSelect } from 'shards-react';
import {
  calculateDays,
  previewNames,
  renderAddress,
  renderSourcePath,
  displayEnum,
  sortEnum,
  pageSize,
} from '../../helpers/printings';
import { updateOrder } from '../../flux/actions';
import printingStates from '../../config/printing-states';

const Table = ({
  toggleSort,
  filterState,
  uiState,
  orders,
  pageActive,
  display,
  setUiState,
  viewFulfillment,
  viewBooks,
}) => {
  const [formData, setFormData] = useState({
    status: '',
    path: '',
  });
  const paginatedOrders = useMemo(() => {
    if (display === displayEnum.BOARD) return [];
    const pageStart = pageActive * pageSize;
    return orders.slice(pageStart, pageStart + pageSize);
  }, [orders, pageActive]);
  const onSave = (order) => {
    updateOrder(order.id, formData);
    cancelEdit();
  };
  const onEdit = (order) => {
    setUiState({ ...uiState, isEdit: order.id });
    setFormData({
      status: order.printings.printing_state,
      path: order.printings.source_path,
    });
  };
  const cancelEdit = () => {
    setUiState({ ...uiState, isEdit: false });
  };
  return (
    <Row>
      <Col>
        <Card small className="mb-4">
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
                              <option key={state.key} value={state.key}>
                                {state.value}
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
                        renderSourcePath(order)
                      )}
                    </td>
                    <td>{previewNames(order)}</td>
                    <td>{renderAddress(order)}</td>
                    <td>
                      <div
                        style={{ maxHeight: 125, overflowY: 'auto' }}
                        dangerouslySetInnerHTML={{ __html: order.printings.note }}
                      />
                    </td>
                    <td>
                      {uiState.isEdit === order.id ? (
                        <>
                          <Button outline size="sm" theme="success" className="mb-2 mr-1" onClick={() => onSave(order)}>
                            Simpan
                          </Button>
                          <Button outline size="sm" theme="secondary" className="mb-2 mr-1" onClick={cancelEdit}>
                            Batal
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button outline size="sm" theme="warning" className="mb-2 mr-1" onClick={() => onEdit(order)}>
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
                          {order.line_items && (
                            <Button outline size="sm" className="mb-2 mr-1" onClick={() => viewBooks(order)}>
                              Lihat Buku
                            </Button>
                          )}
                        </>
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
  );
};
Table.propTypes = {
  toggleSort: PropTypes.func,
  filterState: PropTypes.object,
  uiState: PropTypes.object,
  orders: PropTypes.array,
  pageActive: PropTypes.number,
  display: PropTypes.string,
  setUiState: PropTypes.func,
  viewFulfillment: PropTypes.func,
  viewBooks: PropTypes.func,
};

export default Table;
