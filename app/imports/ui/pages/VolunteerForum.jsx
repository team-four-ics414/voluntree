import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Form, Button, Modal } from 'react-bootstrap';
import ForumPostCard from '../components/forum/ForumPostCard';
import { Posts } from '../../api/forum/PostsCollection';
import LoadingSpinner from '../components/LoadingSpinner';
/** import ForumModal from '../components/forum/ForumModal'; // Replace with your forum post component */

const VolunteerForum = () => {
  // handling the Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
              <Form style={{ fontWeight: 'bolder' }}>
                <Form.Label className="mt-1">Title</Form.Label>
                <Form.Control type="text" placeholder="enter title..." />
                <Form.Label className="mt-3">Information</Form.Label>
                <Form.Control type="text" placeholder="enter details..." />
                <Form.Label className="mt-3">Event Date</Form.Label>
                <Form.Control type="date" placeholder="enter date..." />
                <Form.Label className="mt-3">Event Time</Form.Label>
                <Form.Control type="time" placeholder="enter time..." />
                <Form.Label className="mt-3">Event Location</Form.Label>
                <Form.Control type="text" placeholder="enter location..." />
              </Form>
              <Col style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                <Button variant="success" onClick={handleClose}>Submit</Button>
              </Col>
            </Modal.Body>
          </Modal>
          <Form.Control type="text" placeholder="Search Forums..." style={{ display: 'flex' }} />
          <div className="d-flex flex-wrap overflow-auto mt-4" style={{ maxHeight: '700px' }}>
            {posts.map((post) => <ForumPostCard key={post._id} post={post} />)}
            {/*{posts.map((post) => console.log(post))}*/}
            {/* <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row>
            <Row>
              <ForumPostCard />
            </Row> */}
          </div>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Forum" />);
};

export default VolunteerForum;
