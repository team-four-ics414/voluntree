import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import '../../../client/footer.css'; // Importing the CSS file
import { Facebook, Instagram } from 'react-bootstrap-icons';

const SocialIcon = ({ link, Icon }) => (
  <li>
    <a href={link} className="icon-link">
      <Icon />
    </a>
  </li>
);

SocialIcon.propTypes = {
  link: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired, // elementType is used for React components passed as props
};
const FooterColumn = ({ heading, links }) => (
  <Col md={3} sm={6}>
    <div className="footer-pad">
      <h4>{heading}</h4>
      <ul className="list-unstyled">
        {links.map((link, index) => (
          <li key={index}><a href={link.url}>{link.text}</a></li>
        ))}
      </ul>
    </div>
  </Col>
);

FooterColumn.propTypes = {
  heading: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const Footer = () => {
  const year = new Date().getFullYear();

  const columnLinks = [
    {
      heading: 'Resources',
      links: [
        { text: 'Website Tutorial', url: '#' },
        { text: 'Accessibility', url: '#' },
        { text: 'Disclaimer', url: '#' },
        { text: 'Privacy Policy', url: '#' },
        { text: 'FAQs', url: '/faq' },
        { text: 'Webmaster', url: '#' },
      ],
    },
    {
      heading: 'Departments',
      links: [
        { text: 'Parks and Recreation', url: '#' },
        { text: 'Public Works', url: '#' },
        { text: 'Police Department', url: '#' },
        { text: 'Fire', url: '#' },
        { text: 'Mayor and City Council', url: '#' },
      ],
    },
    // ... Add more columns as needed
  ];

  return (
    <footer className="mainfooter" role="contentinfo">
      <div className="footer-middle">
        <Container>
          <Row>
            <Col md={3} sm={6}>
              <div className="footer-pad">
                <img src="images/voluntree-logo.png" alt="Voluntree Logo" className="img-fluid logo" />
              </div>
            </Col>
            {columnLinks.map((column, index) => (
              <FooterColumn key={index} heading={column.heading} links={column.links} />
            ))}
            <Col md={3}>
              <h4>Follow Us</h4>
              <ul className="social-network">
                <SocialIcon link="#" Icon={Facebook} />
                <SocialIcon link="#" Icon={Instagram} />
                {/* Add more social icons as needed */}
              </ul>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="copy">
              <p className="text-center">&copy; Copyright {year} - Voluntree. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
