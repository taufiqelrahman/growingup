import React, { useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Button, FormGroup, FormSelect } from 'shards-react';
import FileSaver from 'file-saver';
import PageTitle from '../components/common/PageTitle';
import generatePsdScript from '../lib/psd-scripts';

const PsdScripts = () => {
  const [child, setChild] = useState({
    gender: '',
    age: '',
    hair: '',
    skin: '',
  });
  const generate = (e) => {
    e.preventDefault();
    var blob = new Blob([generatePsdScript(child)], { type: 'text/plain;charset=utf-8' });
    const { gender, age, hair, skin } = child;
    FileSaver.saveAs(blob, `${gender}-${age}-${hair}-${skin}.js`);
  };
  const hairOptions = child.gender === 'boy' ? ['short', 'curly'] : ['short', 'hijab'];
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="PSD Scripts" subtitle="Generate script sesuai kebutuhan" className="text-sm-left" />
      </Row>

      <Row>
        <Col sm="6">
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h5>Child customization</h5>
            </CardHeader>
            <CardBody className="p-4">
              <form onSubmit={generate}>
                <FormGroup>
                  <label htmlFor="genderSelect">Gender</label>
                  <FormSelect
                    required
                    id="genderSelect"
                    onChange={(e) => setChild({ ...child, gender: e.target.value })}
                    size="sm"
                  >
                    <option value="">Select gender</option>
                    {['boy', 'girl'].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="ageSelect">Age</label>
                  <FormSelect
                    required
                    id="ageSelect"
                    onChange={(e) => setChild({ ...child, age: e.target.value })}
                    size="sm"
                  >
                    <option value="">Select age</option>
                    {['toddler', 'kid'].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="hairSelect">Hair</label>
                  <FormSelect
                    required
                    id="hairSelect"
                    onChange={(e) => setChild({ ...child, hair: e.target.value })}
                    size="sm"
                  >
                    <option value="">Select hair</option>
                    {hairOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <label htmlFor="skinSelect">Skin</label>
                  <FormSelect
                    required
                    id="skinSelect"
                    onChange={(e) => setChild({ ...child, skin: e.target.value })}
                    size="sm"
                  >
                    <option value="">Select skin</option>
                    {['light', 'medium', 'dark'].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
                {/* <FormGroup>
                  <label htmlFor="languageSelect">Language</label>
                  <FormSelect
                    required
                    id="languageSelect"
                    onChange={(e) => setChild({ ...child, language: e.target.value })}
                    size="sm"
                  >
                    <option value="">Select language</option>
                    {['English', 'Indonesia'].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup> */}
                <Button type="submit" theme="success">
                  Generate
                </Button>
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PsdScripts;
