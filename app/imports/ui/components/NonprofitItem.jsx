import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { PropTypeNonprofit } from '../../api/propTypes/PropTypes';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const NonprofitItem = ({ nonprofit }) => (
  <Card id={COMPONENT_IDS.NONPROFIT_CARD} className="h-100">
    <Card.Header>
      <Card.Img variant="top" src={nonprofit.picture} style={{ height: '100px', width: 'auto', objectFit: 'cover' }} />
      <Card.Title>{nonprofit.name}</Card.Title>
      <Card.Subtitle>{nonprofit.location}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>
        {nonprofit.mission}
      </Card.Text>
      <Link id={COMPONENT_IDS.LIST_NONPROFIT_VIEW} to={`/view-nonprofit/${nonprofit._id}`}>View</Link>
    </Card.Body>
  </Card>
);
// Require a document to be passed to this component.
NonprofitItem.propTypes = {
  nonprofit: PropTypeNonprofit.isRequired,
};

export default NonprofitItem;
