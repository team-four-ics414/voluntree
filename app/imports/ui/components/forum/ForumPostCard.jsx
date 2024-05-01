import React, { useState, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Card, Button, Accordion, Row } from 'react-bootstrap';
import swal from 'sweetalert';
import { useTracker } from 'meteor/react-meteor-data';
import { Trash, Pencil } from 'react-bootstrap-icons';
import { Comments } from '../../../api/forum/CommentsCollection';
import { defineMethod, removeItMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import LoadingSpinner from '../LoadingSpinner';

const dateFormat = (date) => `${date.getDate()}/${
  date.getMonth() + 1}/${
  date.getFullYear()} | ${
  date.getHours()}:${
  date.getMinutes()}`;

const ForumPostCard = ({ post }) => {

  const [commentText, setCommentText] = useState('');
  // const [update, setUpdate] = useState(false);
  const collectionName = Comments.getCollectionName();

  const myRef = useRef(null);
  const commentBeingUpdatedRef = useRef('');
  const idCommentBeingReferencedRef = useRef('');
  const updateRef = useRef(false);

  const handleUpdate = (commentString, id) => {
    setCommentText(commentString);
    commentBeingUpdatedRef.current = commentString;
    idCommentBeingReferencedRef.current = id;
    myRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // setUpdate(true);
    updateRef.current = true;
  };

  const handleDelete = (id) => {
    idCommentBeingReferencedRef.current = id;
    // eslint-disable-next-line no-use-before-define
    deleteComment();
  };

  const handleCancel = () => {
    setCommentText('');
    // setUpdate(false);
    updateRef.current = false;
    console.log('Cancel comment update');
  };

  const deleteComment = () => {
    removeItMethod.callPromise({ collectionName, instance: idCommentBeingReferencedRef.current })
      .catch(error => swal('Error', error.message, 'error'));
    idCommentBeingReferencedRef.current = '';
  };

  const submitComment = (e) => {
    e.preventDefault();

    const insertComment = () => {

      const owner = Meteor.user().username;
      const postId = post._id;
      const dateCreated = new Date();
      const dataToInsert = { postId, contents: commentText, owner, dateCreated, undefined };

      defineMethod.callPromise({ collectionName, definitionData: dataToInsert })
        .catch(error => swal('Error', error.message, 'error'));

      setCommentText('');
    };

    const updateComment = () => {
      const dataToInsert = { id: idCommentBeingReferencedRef.current, contents: commentText };

      updateMethod.callPromise({ collectionName, updateData: dataToInsert })
        .catch(error => swal('Error', error.message, 'error'));

      // setUpdate(false);
      updateRef.current = false;
      setCommentText('');
    };

    // Check for inappropriate content
    Meteor.call('textCheck', commentText, (error) => {
      if (error) {
        swal('Error', 'Inappropriate Content Detected', 'error');
      } else if (updateRef.current) {
        updateComment();
      } else {
        insertComment();
      }
    });
  };

  const { ready, comments } = useTracker(() => {
    const subscription = Comments.subscribeComments();
    const rdy = subscription.ready();
    const commentItems = Comments.find({ postId: post._id }, { sort: { createdAt: 1, lastUpdated: 1 } }).fetch();
    return {
      comments: commentItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Row className="container-fluid">
      <Accordion defaultActiveKey="0">
        <Card style={{ margin: '10px 15px 10px 15px', maxWidth: '96%' }}>
          <Card.Body>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div className="d-flex flex-row mb-3">
                <Card.Title><b>{post.title}</b></Card.Title>
                <i className="mx-3">{post.owner}</i>
                <div style={{ fontFamily: 'sans-serif' }}>
                  {post.lastUpdated ? (
                    <p>Updated: {dateFormat(post.lastUpdated)}</p>
                  ) : (<p>Posted: {dateFormat(post.createdAt)}</p>) }
                </div>
              </div>
              {Meteor.user().username === post.owner ? (
                <Button className="py-0 my-0" variant="danger" onClick={() => Meteor.call('posts.remove', post._id)}>Remove</Button>
              ) : <Button variant="success">I&apos;m Interested</Button>}
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
                {/* {comments.map((comment) => (<ForumComment comment={comment} hook={setCommentText} key={comment._id} />))} */}
                {comments.map((comment) => (
                  <div key={comment._id} style={{ backgroundColor: '#f0f2f5', padding: '10px 10px 5px 10px', borderRadius: '10px', marginBottom: '10px' }}>
                    <div className="d-flex justify-content-between">
                      <h6><b>{comment.owner}</b></h6>
                      {Meteor.user().username === comment.owner ? (
                        <div>
                          <Button className="py-0 my-0 mx-2" variant="warning" onClick={() => handleUpdate(comment.contents, comment._id)}><Pencil /></Button>
                          <Button className="py-0 my-0" variant="danger" onClick={() => handleDelete(comment._id)}><Trash /></Button>
                        </div>
                      ) : ('')}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p>{comment.contents}</p>
                      {comment.lastUpdated ? (
                        <p style={{ fontFamily: 'sans-serif' }}>Edited: {dateFormat(comment.lastUpdated)}</p>
                      ) : (<p style={{ fontFamily: 'sans-serif' }}>{dateFormat(comment.createdAt)}</p>)}
                    </div>
                  </div>
                ))}
                {/** Where the user will add comments to the post */}
                <form ref={myRef} onSubmit={submitComment} className="d-flex">
                  <input
                    type="text"
                    placeholder="Type a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="form-input p-2 flex-grow-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {updateRef.current ? (
                    <>
                      <button type="submit" className="btn btn-warning mx-3" disabled={(!commentText.trim() || commentText === commentBeingUpdatedRef.current)}>Update</button>
                      <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                    </>
                  ) : <button type="submit" className="btn btn-success mx-3" disabled={!commentText.trim()}>Submit</button> }
                </form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card>
      </Accordion>
    </Row>
  ) : <LoadingSpinner message="Loading Forum" />);
};

// const ForumComment = ({ comment, hook }) => (
//   <div style={{ backgroundColor: '#f0f2f5', padding: '10px 10px 5px 10px', borderRadius: '10px', marginBottom: '10px' }}>
//     <div className="d-flex">
//       <h6><b>{comment.owner}</b></h6>
//       { Meteor.user().username === comment.owner ? (
//         <>
//           <Button variant="link" onClick={}>Update</Button>
//           <Button variant="link" onClick={}>Delete</Button>
//         </>
//       ) : ('')}
//     </div>
//     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//       <p> |-- {comment.contents}</p>
//       {comment.lastUpdated ? (
//         <p>Updated {comment.lastUpdated.toDateString()}</p>
//       ) : (<p>Posted: {comment.createdAt.toDateString()}</p>)}
//     </div>
//   </div>
// );

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

// Require a document to be passed to this component.
// ForumComment.propTypes = {
//   comment: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     postId: PropTypes.string.isRequired,
//     contents: PropTypes.string.isRequired,
//     owner: PropTypes.string.isRequired,
//     createdAt: PropTypes.instanceOf(Date),
//     lastUpdated: PropTypes.instanceOf(Date),
//   }).isRequired,
// };

export default ForumPostCard;
