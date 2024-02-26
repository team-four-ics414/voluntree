import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Card, Image, Row, Col, Badge } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { ProfileInterests } from '../../api/interest/ProfileInterestCollection';
import { Interests } from '../../api/interest/InterestCollection';
import LoadingSpinner from '../components/LoadingSpinner';

function getProfileData(userId) {
  const profile = UserProfiles.findOne({ userId });
  const profileInterests = ProfileInterests.find({ profileId: userId }).fetch();
  const interests = profileInterests.map(({ interestId }) => Interests.findOne(interestId).name);
  return { ...profile, interests };
}

const ProfileCard = ({ profile }) => (
  <Col>
    <Card className="h-100">
      <Card.Header>
        <Image src={profile.picture || '/images/defaultuserprofile.png'} roundedCircle width={200} />
        <Card.Title>{profile.firstName} {profile.lastName}</Card.Title>
        <Card.Subtitle>{profile.title}</Card.Subtitle>
        {/* Optionally display email if needed */}
        <Card.Text>{profile.email}</Card.Text>
      </Card.Header>
      <Card.Body>
        <Card.Text>{profile.bio}</Card.Text>
        {/* Display interests */}
        <Card.Text>
          {profile.interests.map((interest, index) => <Badge key={index} bg="info">{interest}</Badge>)}
        </Card.Text>
      </Card.Body>
    </Card>
  </Col>
);

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    bio: PropTypes.string,
    picture: PropTypes.string,
    title: PropTypes.string,
    email: PropTypes.string, // Optional, based on your needs
    interests: PropTypes.arrayOf(PropTypes.string),
    projects: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

const ProfilesPage = () => {
  const { profilesData, ready } = useTracker(() => {
    const handles = [
      Meteor.subscribe('userProfiles'),
      Meteor.subscribe('profileInterests'),
      Meteor.subscribe('interests'),
    ];
    console.log('Subscription readiness:', handles.map(handle => handle.ready()));
    const profiles = UserProfiles.find().fetch().map(profile => getProfileData(profile.userId));
    console.log('Fetched profiles:', profiles);
    return {
      profilesData: profiles,
      ready: handles.every(handle => handle.ready()),
    };
  }, []);

  return ready ? (
    <Container>
      <Row xs={1} md={2} lg={4} className="g-3">
        {profilesData.map((profile, index) => <ProfileCard key={index} profile={profile} />)}
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default ProfilesPage;
