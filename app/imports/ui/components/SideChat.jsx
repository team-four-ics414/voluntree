import React, { useState } from 'react';
import { Col, Button } from 'react-bootstrap';
import '../../../client/chat.css';
import { ChatFill, Send } from 'react-bootstrap-icons';

const SideChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className={`chat-toggle ${isChatOpen ? 'open' : ''}`}>
      <Button variant="success" onClick={toggleChat}>
        {isChatOpen ? (
          <ChatFill />
        ) : (
          <ChatFill />
        )}
      </Button>
      {isChatOpen && (
        <div className="chatColumn">
          <div className="chat-box">
            <div className="chat-header">
              <h4 className="chat-title">Chat</h4>
            </div>
            <Col>
              <div className="sender-text">
                <p>
                  Hello, thank you for signing up for Sunday&apos;s beach cleanup.
                  Please let me know if you have any questions!
                </p>
              </div>
            </Col>
            <Col md={{ offset: 2 }}>
              <div className="receiver-text">
                <p>
                  Hi! Yes, I was wondering if I could bring my own lunch?
                </p>
              </div>
            </Col>
            <form className="chat-input-box flex">
              <input type="text" placeholder="Type your message..." />
            </form>
            <Send className="send-button justify-content-end" /> {/* button is not clickable at the moment */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideChat;
