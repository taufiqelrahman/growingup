import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, FormInput, FormGroup, FormSelect, Modal, ModalBody, ModalHeader } from 'shards-react';
import Skeleton from 'react-loading-skeleton';
import { calculateDays, previewNames, renderAddress, renderSourcePath } from '../../helpers/printings';
import printingStates from '../../config/printing-states';
import printingTeam from '../../config/printing-team';
import { updateOrder } from '../../flux/actions';
import { getBooks } from '../../views/Printing';

const DotEl = styled.span`
  margin-right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #de3636;
`;

const NotesButtonEl = styled(Button)`
  display: inline-flex;
  align-items: center;
  color: black;
  border-color: #1adba2;
  background-color: #1adba2;
`;

const Board = ({ onDragEnd, uiState, orders, viewFulfillment, viewBooks }) => {
  const [sourceModal, setSourceModal] = useState({
    isOpened: false,
    sourcePath: '',
    orderId: null,
  });
  const [logModal, setLogModal] = useState({
    isOpened: false,
    content: '',
  });
  const [notesModal, setNotesModal] = useState({
    isOpened: false,
    content: '',
  });
  const onSaveSource = () => {
    updateOrder(sourceModal.orderId, { path: sourceModal.sourcePath });
    setSourceModal({ ...setSourceModal, isOpened: false, sourcePath: '' });
  };
  const onClickFolder = (order) => {
    setSourceModal({
      ...sourceModal,
      sourcePath: order.printings.source_path,
      isOpened: true,
      orderId: order.id,
    });
  };
  const copyAddress = (orderId) => {
    const addressEl = document.getElementById(`shipping-address-${orderId}`);

    // get address text
    var codeToBeCopied = addressEl.innerText;

    // copy it to empty textarea
    var emptyArea = document.createElement('TEXTAREA');
    emptyArea.style.position = 'absolute';
    emptyArea.innerHTML = codeToBeCopied;

    // append textarea to existing dom
    addressEl.appendChild(emptyArea);

    // copy the text
    emptyArea.select();
    emptyArea.setSelectionRange(0, 99999);
    document.execCommand('copy');

    // remove textarea
    addressEl.removeChild(emptyArea);
  };
  const setAssignee = (id, name) => updateOrder(id, { assignee: name });
  const onViewLog = (order) => setLogModal({ isOpened: true, content: order.printings.note });
  const onViewNotes = (order) => setNotesModal({ isOpened: true, content: order.note });
  return (
    <>
      <div style={{ display: 'flex', overflowX: 'auto', paddingTop: 18, borderTop: '2px solid #d9dde1' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {uiState.loading
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} style={{ marginRight: 16 }}>
                  <Skeleton height={500} width={272} />
                </div>
              ))
            : printingStates.map((state) => (
                <div key={state.key} className="board__droppable">
                  <Droppable droppableId={state.key}>
                    {(provided, snapshot) => (
                      <div className="board__droppable__container">
                        <div className="board__droppable__head">{state.value}</div>
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="board__droppable__body"
                          style={{
                            backgroundColor: snapshot.isDraggingOver ? '#ec9f84' : '#e68664',
                          }}
                        >
                          <>
                            {provided.placeholder}
                            {orders
                              .filter((order) => order.printings.printing_state === state.key)
                              .map((order, index) => {
                                const daysLeft = calculateDays(order.printings.created_at);
                                const daysClassName = daysLeft < 5 ? (daysLeft < 3 ? 'alert' : 'warning') : 'safe';
                                return (
                                  <Draggable
                                    key={order.id}
                                    draggableId={order.id.toString()}
                                    index={index}
                                    isDragDisabled={uiState.updating}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="board__draggable"
                                      >
                                        <div className="board__draggable__title">
                                          {!['DONE', 'RETURN_SENT'].includes(state.key) && (
                                            <span
                                              className={`board__draggable__remaining board__draggable__remaining--${daysClassName}`}
                                            >
                                              {daysLeft} hari
                                            </span>
                                          )}
                                          {order.order_number} - {previewNames(order)}
                                        </div>
                                        <div style={{ marginBottom: 6 }}>
                                          <span style={{ fontWeight: 500 }}>Folder: &nbsp;</span>
                                          {renderSourcePath(order)}
                                        </div>
                                        <div style={{ marginBottom: 6 }}>
                                          <label htmlFor="assignee" style={{ fontWeight: 500 }}>
                                            Assignee
                                          </label>
                                          <FormSelect
                                            id="assignee"
                                            defaultValue={order.printings.assignee}
                                            onChange={(e) => setAssignee(order.id, e.target.value)}
                                            size="sm"
                                            style={{ width: 'auto', marginLeft: 6 }}
                                          >
                                            <option value="unassigned">Belum ada</option>
                                            {printingTeam.map((member) => (
                                              <option key={member} value={member}>
                                                {member}
                                              </option>
                                            ))}
                                          </FormSelect>
                                        </div>
                                        {!!order.note_attributes.length && (
                                          <div style={{ marginBottom: 6 }}>
                                            <span style={{ fontWeight: 500 }}>Booking Code: &nbsp;</span>
                                            {
                                              (order.note_attributes.find((att) => att.name === 'bookingCode') || {})
                                                .value
                                            }
                                          </div>
                                        )}
                                        <div style={{ fontWeight: 500 }}>Tipe anak:</div>
                                        <div>
                                          {getBooks(order).map((book) => (
                                            <div key={book.id}>
                                              {`${book.Gender}-${book.Age}-${book.Hair}-${book.Skin}`}
                                            </div>
                                          ))}
                                        </div>
                                        <div style={{ fontWeight: 500 }}>Alamat:</div>
                                        <div>{renderAddress(order)}</div>
                                        <Button
                                          size="sm"
                                          theme="success"
                                          className="mt-3 mr-1"
                                          onClick={() => viewFulfillment(order)}
                                        >
                                          Resi
                                        </Button>
                                        <Button
                                          size="sm"
                                          theme="warning"
                                          className="mt-3 mr-1"
                                          onClick={() => onClickFolder(order)}
                                        >
                                          Folder
                                        </Button>
                                        {order.line_items && (
                                          <Button
                                            size="sm"
                                            theme="info"
                                            className="mt-3 mr-1"
                                            onClick={() => viewBooks(order)}
                                          >
                                            Lihat Buku
                                          </Button>
                                        )}
                                        <Button size="sm" className="mt-3 mr-1" onClick={() => copyAddress(order.id)}>
                                          Copy
                                        </Button>
                                        <Button
                                          size="sm"
                                          theme="light"
                                          className="mt-3 mr-1"
                                          onClick={() => onViewLog(order)}
                                        >
                                          Log
                                        </Button>
                                        {order.note && (
                                          <NotesButtonEl
                                            size="sm"
                                            theme="success"
                                            className="mt-3 mr-1"
                                            onClick={() => onViewNotes(order)}
                                          >
                                            <DotEl />
                                            Notes
                                          </NotesButtonEl>
                                        )}
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                            {uiState.updating === state.key && <span style={{ color: 'white' }}>updating...</span>}
                          </>
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
        </DragDropContext>
      </div>

      <Modal
        open={sourceModal.isOpened}
        toggle={() => setSourceModal({ ...sourceModal, isOpened: !sourceModal.isOpened })}
      >
        <ModalHeader>Folder</ModalHeader>
        <ModalBody>
          <form onSubmit={onSaveSource}>
            <FormGroup>
              <label htmlFor="folderSource">Folder</label>
              <FormInput
                id="folderSource"
                placeholder="Path Folder"
                defaultValue={sourceModal.sourcePath}
                onChange={(e) => setSourceModal({ ...sourceModal, sourcePath: e.target.value })}
                size="sm"
              />
            </FormGroup>
            <Button outline size="sm" className="mb-2 mr-1">
              Simpan
            </Button>
          </form>
        </ModalBody>
      </Modal>
      <Modal open={logModal.isOpened} toggle={() => setLogModal({ ...logModal, isOpened: !logModal.isOpened })}>
        <ModalHeader>Log</ModalHeader>
        <ModalBody>
          <div dangerouslySetInnerHTML={{ __html: logModal.content }} />
        </ModalBody>
      </Modal>
      <Modal open={notesModal.isOpened} toggle={() => setNotesModal({ ...notesModal, isOpened: !notesModal.isOpened })}>
        <ModalHeader>Notes</ModalHeader>
        <ModalBody>
          <div dangerouslySetInnerHTML={{ __html: notesModal.content }} />
        </ModalBody>
      </Modal>
    </>
  );
};
Board.propTypes = {
  onDragEnd: PropTypes.func,
  uiState: PropTypes.object,
  orders: PropTypes.array,
  viewFulfillment: PropTypes.func,
  viewBooks: PropTypes.func,
};

export default Board;
