import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ForumPostCard from '../components/forum/ForumPostCard'; // Replace with your forum post component

const VolunteerForum = ({ forumPosts }) => {
  return (
    <Container id="VOLUNTEER_FORUM" className="py-3">
      <Row>
        {/* Forum posts column */}
        <Col className="p-5">
          <h1>Volunteer Forum</h1>
          {/* Temporary Way for Cards to Display on the Forum Page*/}
          {/* After we have some sort of collection we will display the cards with that*/}
          <div className="d-flex flex-wrap overflow-auto mt-4" style={{ maxHeight: "600px" }}>
            <Row>
                  <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VolunteerForum;