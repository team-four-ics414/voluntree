import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Dropdown } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';

const ListOpportunities = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // TO BE REPLACED WITH ACTUAL DATA FROM COLLECTION
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
    {
      name: 'Arts & Culture',
      image: 'images/sample1.jpg',
      description: '',
      category: 'Arts & Culture',
    },
    {
      name: 'Seniors',
      image: 'images/sample1.jpg',
      description: '',
      category: 'Nursing',
    },
    {
      name: 'Church',
      image: 'images/sample1.jpg',
      description: '',
      category: 'Faith-Based',
    },
  ];

  const handleInfoClick = (opportunity) => {
    setShowInfo(!showInfo);
    setSelectedOpportunity(opportunity);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category); // Toggle selected category
  };

  const filteredOpportunities = () => {
    let filtered = opportunities;
    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(opportunity => opportunity.name.toLowerCase().includes(normalizedQuery) ||
        opportunity.description.toLowerCase().includes(normalizedQuery));
    }
    if (selectedCategory) {
      filtered = filtered.filter(opportunity => opportunity.category === selectedCategory);
    }
    return filtered;
  };

  return (
    <Container className="py-3">
      <Row className={`py-3 ${showInfo ? '' : 'blur-background'}`}>
        <Col>
          <Col className="text-start">
            <div className="d-flex align-items-center">
              <BsSearch size={15} color="white" className="mr-2" />
              <h3 className="search-header">Find Volunteer Opportunities</h3>
            </div>
          </Col>
          {/* Search bar */}
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
              <Dropdown className="mb-3">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  Filter By Category
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {[' ', 'Agriculture', 'Cleanup', 'Education', 'Medicine', 'Animals', 'Arts & Culture', 'Faith-Based', 'Technology', 'Disaster Relief'].map((category, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleCategorySelect(category)}
                      active={selectedCategory === category}
                    >
                      {category}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
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
          {/* Information Card */}
          {showInfo && selectedOpportunity && (
            <div className={`information-card ${showInfo ? 'active' : ''}`}>
              <h2>{selectedOpportunity.name}</h2>
              <img
                src={selectedOpportunity.image}
                alt={selectedOpportunity.name}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <p>{selectedOpportunity.description}</p>
              {/* TO DO: add more info */}
              <Button variant="secondary" onClick={handleInfoClick}>
                Close
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ListOpportunities;
