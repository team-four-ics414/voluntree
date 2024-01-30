import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';
import 'font-awesome/css/font-awesome.min.css';

/* A simple static component to render the chatbox for the landing page. */
const Chat = () => (
  <Container id={PAGE_IDS.CHAT} className="py-3 justify-content-center chat-container">
    <Row className="justify-content-center">
      <Col xs={8}>
        <div className="chat-box">
          <div className="chat-header">
            <h4 className="chat-title">Chat</h4>
            {/* Add icons or buttons for actions here */}
          </div>
          <div className="chat-messages">
            <p>Hello, world! </p> {/* Placeholder message */}
          </div>
          <form className="chat-input">
            <input type="text" placeholder="Type your message..." />
            <button type="button" className="chat-send-button">
              <i className="fa-regular fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </Col>
    </Row>
  </Container>
);

export default Chat;
