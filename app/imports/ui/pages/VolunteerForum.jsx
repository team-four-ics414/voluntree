import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Form, Button, Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import ForumPostCard from '../components/forum/ForumPostCard';
import { Posts } from '../../api/forum/PostsCollection';
import LoadingSpinner from '../components/LoadingSpinner';
import { defineMethod } from '../../api/base/BaseCollection.methods';
/** import ForumModal from '../components/forum/ForumModal'; // Replace with your forum post component */

// const bridgePost = new SimpleSchema2Bridge(Posts.getSchema());

const VolunteerForum = () => {
  const [show, setShow] = useState(false);
  const [addEventShow, setAddEventShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const collectionName = Posts.getCollectionName();

  const handleClose = () => {
    setShow(false);
    // eslint-disable-next-line no-use-before-define
    setAddEventShow(false);
  };
  const handleShow = () => setShow(true);
  const handleAddEvent = () => setAddEventShow(!addEventShow);
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPosts = () => {
    // eslint-disable-next-line no-use-before-define
    let filtered = posts;
    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(post => post.title.toLowerCase().includes(normalizedQuery) ||
        post.contents.toLowerCase().includes(normalizedQuery) || post.owner.toLowerCase().includes(normalizedQuery));
    }
    return filtered;
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    formDataObj.owner = Meteor.user().username;
    formDataObj._id = Meteor.randomId;

    const concat = Object.values(formDataObj).join(' ');

    const addPost = () => {
      defineMethod.callPromise({ collectionName, definitionData: formDataObj })
        .then(() => {
          handleClose();
          swal('Success', 'Post added successfully', 'success');
        })
        .catch(error => swal('Error', error.message, 'error'));
    };

    // Check for inappropriate content
    Meteor.call('textCheck', concat, (error) => {
      if (error) {
        swal('Error', 'Inappropriate Content Detected', 'error');
      } else {
        addPost();
      }
    });
  };

  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, posts } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Posts documents.
    const subscription = Posts.subscribePosts();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Posts documents from sorted from newest to latest.
    const postItems = Posts.find({}, { sort: { createdAt: -1 } }).fetch();
    return {
      posts: postItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container id="VOLUNTEER_FORUM" className="py-3">
      <Row style={{ backgroundColor: '#f0f2f5', borderRadius: '30px' }}>
        {/* Forum posts column */}
        <Col className="p-5">
          <h1>Volunteer Forum</h1>
          <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '10px' }}>
            <Button variant="success" onClick={handleShow}>
              +Create Forum
            </Button>
          </div>
          {/** TESTING ZONE */}
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Add Post
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={onFormSubmit} style={{ fontWeight: 'bolder' }}>
                <Form.Label className="mt-1">Title</Form.Label>
                <Form.Control name="title" type="text" placeholder="Enter title..." />
                <Form.Label className="mt-3">Information</Form.Label>
                <Form.Control name="contents" as="textarea" placeholder="Enter details..." />
                <Form.Check onClick={handleAddEvent} type="checkbox" label="Create associated event" />
                {addEventShow ? (
                  <>
                    <Form.Label className="mt-3">Event Date</Form.Label>
                    <Form.Control type="date" placeholder="enter date..." />
                    <Form.Label className="mt-3">Event Time</Form.Label>
                    <Form.Control type="time" placeholder="enter time..." />
                    <Form.Label className="mt-3">Event Location</Form.Label>
                    <Form.Control type="text" placeholder="enter location..." />
                  </>
                ) : ''}
                <Col style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                  <Button variant="success" type="submit">Submit</Button>
                </Col>
              </Form>
            </Modal.Body>
          </Modal>
          <Form.Control
            type="text"
            placeholder="Search Forums..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="search-input"
          />
          <div className="d-flex flex-wrap overflow-auto mt-4" style={{ maxHeight: '700px' }}>
            {filteredPosts().map((post) => <ForumPostCard key={post._id} post={post} />)}
          </div>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Forum" />);
};

export default VolunteerForum;
