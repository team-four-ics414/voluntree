import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Dropdown } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import { Opportunity } from '../../api/opportunities/OpportunityCollection';

const ListOpportunities = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const opportunitySubscription = Opportunity.subscribeOpportunity();
    return () => {
      opportunitySubscription.stop();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Opportunity.find().fetch();
      setOpportunities(data);
    };
    fetchData();
  }, []);

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
    if (selectedCategory && selectedCategory !== 'All') {
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
              <BsSearch size={15} color="green" className="mr-2" />
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
                  <Dropdown.Item onClick={() => handleCategorySelect('All')} active={!selectedCategory}>All</Dropdown.Item>
                  {['Agriculture', 'Cleanup', 'Education', 'Medicine', 'Animals', 'Arts & Culture', 'Faith-Based', 'Technology', 'Disaster Relief'].map((category, index) => (
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
              <p><strong>Location:</strong> {selectedOpportunity.location}</p>
              <p><strong>Time:</strong> {selectedOpportunity.time}</p>
              <p><strong>Frequency:</strong> {selectedOpportunity.frequency}</p>

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
