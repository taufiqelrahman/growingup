import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'shards-react';
import { getUsers } from '../flux/actions';
import store from '../flux/store';
import PageTitle from '../components/common/PageTitle';

const Users = () => {
  const [users, setUsers] = useState(store.getUsers());
  useEffect(() => {
    store.addChangeListener(onChange);
    if (store.getUsers().length === 0) getUsers();
    return () => store.removeChangeListener(onChange);
  }, []);

  function onChange() {
    setUsers(store.getUsers());
  }
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
                    <th scope="col" className="border-0">
                      Name
                    </th>
                    <th scope="col" className="border-0">
                      Email
                    </th>
                    <th scope="col" className="border-0">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
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
