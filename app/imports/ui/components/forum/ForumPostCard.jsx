import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ForumPostCard = ({ post }) => {
  return (
    <Card style={{margin: "10px 15px 10px 15px", maxWidth: "96%"}}>
      <Card.Body>
        <Card.Title>In need of Dog sitter</Card.Title>
        <Card.Text>I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please.
        </Card.Text>
        <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="success">I'm Interested</Button>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export default ForumPostCard;
