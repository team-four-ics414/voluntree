import React from 'react';
import { Card } from 'react-bootstrap';

const ForumPostCard = ({ post }) => {
  return (
    <Card style={{margin: "10px 15px 10px 15px", maxWidth: "96%"}}>
      <Card.Body>
        <Card.Title>In need of Dog sitter</Card.Title>
        <Card.Text>I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please. I need a dog sitter please please please.</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ForumPostCard;
