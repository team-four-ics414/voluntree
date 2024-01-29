import React from 'react';
import { Container } from 'react-bootstrap';
import { PAGE_IDS } from '../utilities/PageIDs';

const AboutUs = () => (
  <div>
    <Container id={PAGE_IDS.ABOUT_US} fluid className="text-center">
      <h1>Welcome to the Voluntree</h1>
      <p>Innovating Volunteer Engagement</p>
    </Container>

    <Container className="my-4 text-center">
      <h2>Our Mission</h2>
      <p>
        {/* eslint-disable-next-line max-len */}
        Our mission is to empower individuals to impact their communities by enhancing the volunteer experience. We aim to remove barriers for volunteers and philanthropists, providing an accessible platform that connects community needs with those eager to help. Recognizing the inherent desire to contribute, our platform is designed to facilitate and streamline the process of finding and engaging in volunteer opportunities. We are dedicated to making it easier for those ready to serve to connect with the avenues where they can make the most impact.
      </p>
    </Container>

    <Container className="my-4 text-center">
      <h2>Transforming Volunteer Engagement</h2>
      <p>
        {/* eslint-disable-next-line max-len */}
        Voluntree is reimagining how volunteers and philanthropic organizations interact, making it simpler and more effective. Our platform offers an easy-to-use interface with comprehensive features that enhance engagement. By integrating social elements, we bring the spirit of volunteering into the heart of communities, fostering a collective effort towards common goals.
      </p>
    </Container>
  </div>
);

export default AboutUs;