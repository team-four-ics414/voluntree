import React from 'react';
import { Card, Col, Image, Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';

// ProfileCard Component
const ProfileCard = ({ profile }) => (
  <Col xs={12} sm={6} md={4} lg={3} className="py-2 px-2">
    <Card className="h-100">
      <Card.Header className="text-center">
        <div className="d-flex justify-content-center align-items-center">
          <Image src={profile.picture || '/images/defaultuserprofile.png'} alt={`${profile.firstName} ${profile.lastName}'s profile picture`} roundedCircle className="img-fluid" style={{ maxWidth: '100%', maxHeight: '70%' }} />
        </div>
        <Card.Title className="mt-2">{profile.firstName} {profile.lastName}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{profile.title}</Card.Subtitle>
        {/* Optionally display email if needed */}
        {profile.email && <Card.Text className="mb-0">{profile.email}</Card.Text>}
      </Card.Header>
      <Card.Body>
        {profile.bio && <Card.Text>{profile.bio}</Card.Text>}
        {/* Display interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="d-flex flex-wrap justify-content-center">
            {profile.interests.map((interest, index) => (
              <Badge key={index} bg="info" className="me-2 mb-2">{interest}</Badge>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  </Col>
);

// Prop Types for validation
ProfileCard.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    bio: PropTypes.string,
    picture: PropTypes.string,
    title: PropTypes.string,
    email: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ProfileCard;
