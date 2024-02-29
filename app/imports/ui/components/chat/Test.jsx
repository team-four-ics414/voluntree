import React, { useState } from 'react';

const ChatComponent = () => {
  const [currentMessage, setCurrentMessage] = useState('');

  // Dummy data for members and messages.
  const members = [
    { id: 1, name: 'John Doe', lastMessage: 'Hello, Are you there?', time: 'Just now', unread: 1, avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp' },
    // ... more members
  ];

  const messages = [
    { id: 1, sender: 'Brad Pitt', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', time: '12 mins ago', avatar: 'https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp' },
    // ... more messages
  ];

  return (
      <section className="gradient-custom h-screen">
        <div className="container py-5 mx-auto">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-6/12 lg:w-5/12 xl:w-5/12 px-2 mb-4 md:mb-0">
              <h5 className="text-center text-white font-bold mb-3">Member</h5>
              <div className="mask-custom rounded-2xl p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
                {members.map((member) => (
                    <div key={member.id} className="flex justify-between items-center p-2 border-b border-white/30">
                      <div className="flex items-center">
                        <img src={member.avatar} alt={member.name} className="rounded-circle shadow-1-strong me-3" width="60" />
                        <div>
                          <p className="font-bold text-white mb-0">{member.name}</p>
                          <p className="text-white text-sm">{member.lastMessage}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-white text-sm mb-1">{member.time}</p>
                        {member.unread > 0 && <span className="badge bg-danger float-end">{member.unread}</span>}
                      </div>
                    </div>
                ))}
              </div>
            </div>
            <div className="w-full md:w-6/12 lg:w-7/12 xl:w-7/12 px-2">
              <div className="mask-custom rounded-2xl p-4 overflow-auto" style={{ maxHeight: '80vh' }}>
                {messages.map((msg) => (
                    <div key={msg.id} className="mb-4">
                      <div className="flex justify-between items-center">
                        <img src={msg.avatar} alt={msg.sender} className="rounded-circle shadow-1-strong me-3" width="60" />
                        <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-bold text-white">{msg.sender}</p>
                            <p className="text-light small text-white"><i className="far fa-clock"></i> {msg.time}</p>
                          </div>
                          <p className="text-white">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
              <div className="mt-4">
              <textarea
                  className="form-control w-full rounded-lg bg-white/20 p-2 text-white"
                  rows="4"
                  placeholder="Message"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
              ></textarea>
                <button
                    type="button"
                    className="btn btn-light btn-lg btn-rounded float-right mt-2"
                    onClick={() => { /* Handle sending message */ }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default ChatComponent;
