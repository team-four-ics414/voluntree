import React from 'react';
import { Card, Button, Accordion } from 'react-bootstrap';

const ForumPostCard = ({ post }) => {
  return (
    <Accordion defaultActiveKey="0">
      <Card style={{margin: "10px 15px 10px 15px", maxWidth: "96%"}}>
        <Card.Body>
          <Card.Title>In need of Dog sitter</Card.Title>
          <Card.Text>I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please.
          </Card.Text>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="success">I'm Interested</Button>
          </div>
        </Card.Body>
        <Accordion defaultActiveKey="1">
          <Accordion.Button eventKey="0">Read more</Accordion.Button>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <Card.Text>
              BLAH BLAH BLAH BLAH
              </Card.Text>
            </Card.Body>
          </Accordion.Collapse>
        </Accordion>
      </Card>
    </Accordion>
  );
};

export default ForumPostCard;
