import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Accordion, Form, Row } from 'react-bootstrap';

const ForumPostCard = ({ post }) => {

  return (
    <Row>
      <Accordion defaultActiveKey="0">
        <Card style={{ margin: '10px 15px 10px 15px', maxWidth: '96%' }}>
          <Card.Body>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Card.Title><b>{post.title}</b></Card.Title>
              <Button variant="success">I&apos;m Interested</Button>
            </div>
            <Card.Text>
              {post.contents}
            </Card.Text>
            {/* If forum post has an attached event. */}
            { post.eventId ? (
              <Card.Text>
                <b>Event Date:</b> 01/23/24<br />
                <b>Event Time:</b> All Day<br />
                <b>Location:</b> 123 Your St<br />
              </Card.Text>
            ) : ''}
          </Card.Body>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="1">
              <Accordion.Header>Responses</Accordion.Header>
              <Accordion.Body>
                <div style={{ backgroundColor: '#f0f2f5', padding: '10px 10px 5px 10px', borderRadius: '10px', marginBottom: '10px' }}>
                  <h6><b>Melissa Clark</b></h6>
                  <p> |-- Hi! I&apos;d be interested in taking care of your dog for you!</p>
                </div>
                <div style={{ backgroundColor: '#f0f2f5', padding: '10px 10px 5px 10px', borderRadius: '10px', marginBottom: '10px' }}>
                  <h6><b>Tyler Durden</b></h6>
                  <p> |-- I&apos;m interested!</p>
                </div>
                <div style={{ backgroundColor: '#f0f2f5', padding: '10px 10px 5px 10px', borderRadius: '10px', marginBottom: '10px' }}>
                  <h6><b>Jame Franco</b></h6>
                  <p> |-- Does he like to go on runs?</p>
                </div>
                {/** Where the user will add comments to the post */}
                <Form.Control type="text" placeholder="Add Response..." />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card>
      </Accordion>
    </Row>
  );
};

// Require a document to be passed to this component.
ForumPostCard.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    contents: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date),
    lastUpdated: PropTypes.string,
    eventId: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ForumPostCard;
