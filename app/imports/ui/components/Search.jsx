import React from 'react';
import { Col, Form, InputGroup, FormControl } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

const SearchPage = () => (
  <Col md={6}>
    <Form inline>
      <InputGroup>
        <InputGroup.Text>
          <Search />
        </InputGroup.Text>
        <FormControl type="text" placeholder="Search" aria-label="Search" />
      </InputGroup>
    </Form>
  </Col>
);

export default SearchPage;
