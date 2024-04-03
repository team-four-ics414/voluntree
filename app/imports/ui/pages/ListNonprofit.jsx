import React, { useState } from 'react';
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { BsSearch } from 'react-icons/bs';
import { Nonprofits } from '../../api/nonprofit/NonprofitCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import NonprofitItem from '../components/NonprofitItem';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const ListNonprofit = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const { ready, nonprofits } = useTracker(() => {
    const subscription = Nonprofits.subscribeNonprofit();
    return {
      nonprofits: Nonprofits.find({}).fetch(),
      ready: subscription.ready(),
    };
  }, []);

  const filteredNonprofits = nonprofits.filter((nonprofit) => {
    const normalizedQuery = searchQuery.toLowerCase();
    return nonprofit.name.toLowerCase().includes(normalizedQuery) ||
      nonprofit.mission.toLowerCase().includes(normalizedQuery);

  });

  return (ready ? (
    <Container id={PAGE_IDS.LIST_NONPROFIT} className="py-3">
      <Row className="d-flex">
        <Col md={7}>
          <Col className="text-start">
            <div className="d-flex align-items-center">
              <BsSearch size={15} color="green" className="mr-2" />
              <h3 className="search-header">Find Nonprofits</h3>
            </div>
          </Col>
          { /* Search Bar */ }
          <Row className="mb-3">
            <Col xs={8} md={6}>
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="search-input"
              />
            </Col>
            <Col>
              <Button variant="success" id={COMPONENT_IDS.NONPROFIT_ADD_BTN} href="/add-nonprofit">Add Nonprofit</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredNonprofits.map((nonprofit) => (
          <Col key={nonprofit._id}><NonprofitItem nonprofit={nonprofit} /></Col>
        ))}
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Nonprofits" />);
};

export default ListNonprofit;
