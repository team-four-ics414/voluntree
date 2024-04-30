import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Card, Button, Accordion, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { useTracker } from 'meteor/react-meteor-data';
import ForumComments from './ForumComments';
import { Comments } from '../../../api/forum/CommentsCollection';
import { defineMethod } from '../../../api/base/BaseCollection.methods';
import LoadingSpinner from '../LoadingSpinner';

const ForumPostCard = ({ post }) => {

  const [commentText, setCommentText] = useState('');

  const submitComment = (e) => {
    e.preventDefault();

    const insertComment = () => {

      const owner = Meteor.user().username;
      const postId = post._id;
      const dateCreated = new Date();
      const dataToInsert = { postId, contents: commentText, owner, dateCreated, undefined };

      const collectionName = Comments.getCollectionName();
      defineMethod.callPromise({ collectionName, definitionData: dataToInsert })
        .catch(error => swal('Error', error.message, 'error'));

      setCommentText('');
    };

    // Check for inappropriate content
    Meteor.call('textCheck', commentText, (error) => {
      if (error) {
        swal('Error', 'Inappropriate Content Detected', 'error');
      } else {
        insertComment();
      }
    });
  };

  const { ready, comments } = useTracker(() => {
    const subscription = Comments.subscribeComments();
    const rdy = subscription.ready();
    const commentItems = Comments.find({ postId: post._id }, { sort: { createdAt: 1 } }).fetch();
    return {
      comments: commentItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
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
                <b>Needs to be synced with event collection!</b><br />
              </Card.Text>
            ) : ''}
          </Card.Body>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="1">
              <Accordion.Header>Comments</Accordion.Header>
              <Accordion.Body>
                {comments.map((comment) => (<ForumComments comment={comment} key={comment._id} />))}
                {/** Where the user will add comments to the post */}
                <form onSubmit={submitComment} className="flex flex-col space-y-4 p-4">
                  <input
                    type="text"
                    placeholder="Type a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={!commentText.trim()} // If field is empty.
                  >
                    Send
                  </button>
                </form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card>
      </Accordion>
    </Row>
  ) : <LoadingSpinner message="Loading Forum" />);
};

// Require a document to be passed to this component.
ForumPostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    contents: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    createdAt: PropTypes.instanceOf(Date),
    lastUpdated: PropTypes.instanceOf(Date),
    eventId: PropTypes.string,
  }).isRequired,
};

export default ForumPostCard;
