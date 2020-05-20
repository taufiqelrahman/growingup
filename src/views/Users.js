import React, { useEffect, useState, Fragment } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Button, FormInput, FormGroup } from 'shards-react';
import { getUsers, updateUser } from '../flux/actions';
import store from '../flux/store';
import PageTitle from '../components/common/PageTitle';

const Users = () => {
  const [users, setUsers] = useState(store.getUsers());
  const [isEdit, setIsEdit] = useState(false);
  const [phone, setPhone] = useState(null);
  useEffect(() => {
    store.addChangeListener(onChange);
    if (store.getUsers().length === 0) getUsers();
    return () => store.removeChangeListener(onChange);
  }, []);

  function onChange() {
    setUsers(store.getUsers());
  }
  const onTextChange = (event) => {
    setPhone(event.target.value);
  };
  const onEdit = (user) => {
    setIsEdit(user.id);
    setPhone(user.phone);
  };
  const cancelEdit = () => {
    setIsEdit(false);
  };
  const onSave = (user) => {
    updateUser(user.id, { phone });
    cancelEdit();
  };
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Users" subtitle="Edit Users" className="text-sm-left" />
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Active Users</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0" width="25%">
                      Name
                    </th>
                    <th scope="col" className="border-0" width="25%">
                      Email
                    </th>
                    <th scope="col" className="border-0">
                      Phone
                    </th>
                    <th scope="col" className="border-0" width="20%">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        {isEdit === user.id ? (
                          <FormGroup>
                            <FormInput
                              id="inputPhone"
                              placeholder="Phone"
                              defaultValue={user.phone}
                              onChange={onTextChange}
                              size="sm"
                              type="number"
                            />
                          </FormGroup>
                        ) : (
                          user.phone
                        )}
                      </td>
                      <td>
                        {isEdit === user.id ? (
                          <Fragment>
                            <Button
                              outline
                              size="sm"
                              theme="primary"
                              className="mb-2 mr-1"
                              onClick={() => onSave(user)}
                            >
                              Save
                            </Button>
                            <Button outline size="sm" theme="secondary" className="mb-2 mr-1" onClick={cancelEdit}>
                              Cancel
                            </Button>
                          </Fragment>
                        ) : (
                          <Button outline size="sm" theme="warning" className="mb-2 mr-1" onClick={() => onEdit(user)}>
                            Edit
                          </Button>
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
    </Container>
  );
};

export default Users;
