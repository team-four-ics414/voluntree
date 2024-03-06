import React from 'react';
import { Card, Button, Accordion, Form } from 'react-bootstrap';

const ForumPostCard = () => (
  <Accordion defaultActiveKey="0">
    <Card style={{ margin: '10px 15px 10px 15px', maxWidth: '96%' }}>
      <Card.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <Card.Title><b>In need of Dog sitter</b></Card.Title>
          <Button variant="success">I&apos;m Interested</Button>
        </div>
        <Card.Text>I need a dog sitter please please please. I am looking for someone who can sit on my dog. He is a good boy, his name is max. He is a golden retriever and very well-behaved/friendly.
          I just need someone to take care of him for this weekend while I am out of town. Please let me know if you have any questions or are interested. Thanks!!
        </Card.Text>
        <Card.Text>
          <b>Event Date:</b> 01/23/24<br />
          <b>Event Time:</b> All Day<br />
          <b>Location:</b> 123 Your St<br />
        </Card.Text>
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
);

export default ForumPostCard;
