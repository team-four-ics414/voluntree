import PropTypes from 'prop-types';

const PropTypeNonprofit = PropTypes.shape({
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  mission: PropTypes.string.isRequired,
  contactInfo: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date),
  picture: PropTypes.string,
});

export { PropTypeNonprofit };
