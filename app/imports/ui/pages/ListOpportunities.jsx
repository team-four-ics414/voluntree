import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
const DropdownFilter = ({ filter, handleChangeFilter }) => (
  <div>
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label className="filter-container">Filter: </label>
    <select
      name="filter"
      value={filter}
      onChange={handleChangeFilter}
    >
      <option value="">-- Please Select --</option>
      <option value="all">All</option>
      <option value="Cleanup">Cleanup</option>
      <option value="Education">Education</option>
      <option value="Medicine">Medicine</option>
    </select>
  </div>
);

const ListOpportunities = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [filter, setFilter] = useState('all');

  const opportunities = [
    {
      name: 'Agriculture',
      image: 'images/sample1.jpg',
      description: 'Learn more about farming.',
      category: 'Agriculture',
    },
    {
      name: 'Cleanup',
      image: 'images/sample3.jpg',
      description: 'Help clean up the community.',
      category: 'Cleanup',
    },
    {
      name: 'Education',
      image: 'images/sample2.jpg',
      description: 'Volunteer for educational programs.',
      category: 'Education',
    },
    {
      name: 'Medicine',
      image: 'images/sample4.jpg',
      description: 'Assist in medical outreach programs.',
      category: 'Medicine',
    },
  ];

  // eslint-disable-next-line no-unused-vars
  const handleInfoClick = (opportunity) => {
    // Add functionality to handle information click
    setShowInfo(!showInfo);
  };

  const handleChangeFilter = (event) => {
    setFilter(event.target.value);
  };

  const filteredOpportunities = () => {
    if (filter === 'all') {
      return opportunities;
    }
    return opportunities.filter((opportunity) => opportunity.category === filter);
  };

  return (
    <Container className="py-3">
      <Row className={`py-3 ${showInfo ? 'blur-background' : ''}`}>
        <Col>
          <Col className="text-center">
            <h2>Volunteer Opportunities</h2>
          </Col>
          <Row className="mb-3">
            <DropdownFilter filter={filter} handleChangeFilter={handleChangeFilter} />
          </Row>
          {/* Opportunity Cards */}
          <Row xs={1} md={2} lg={3} className={`g-4 ${showInfo ? 'slide-out' : ''}`}>
            {filteredOpportunities().map((opportunity, index) => (
              <Col key={index}>
                <div className={`card ${showInfo && 'fade-out'}`}>
                  <img
                    src={opportunity.image}
                    alt={opportunity.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{opportunity.name}</h5>
                    <p className="card-text">{opportunity.description}</p>
                  </div>
                  <div className="card-body text-end">
                    <Button variant="outline-success" onClick={() => handleInfoClick(opportunity)}>
                      More Info <span>&rarr;</span>
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ListOpportunities;
