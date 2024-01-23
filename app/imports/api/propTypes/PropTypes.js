import PropTypes from 'prop-types';

const PropTypeNonprofit = PropTypes.shape({
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  mission: PropTypes.string.isRequired,
  contactInfo: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  createdAt: PropTypes.instanceOf(Date).isRequired,
  _id: PropTypes.string.isRequired,
  picture: PropTypes.string,
});

export { PropTypeNonprofit };
