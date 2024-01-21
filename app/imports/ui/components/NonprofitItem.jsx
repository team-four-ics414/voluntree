import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { PropTypeNonprofit } from '../../api/propTypes/PropTypes';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const NonprofitItem = ({ nonprofit }) => (
  <Card className="h-100">
    <Card.Header>
      <Card.Img variant="top" src={nonprofit.picture} style={{ width: '75px' }} />
      <Card.Title>{nonprofit.name}</Card.Title>
      <Card.Subtitle>{nonprofit.location}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>
        {nonprofit.mission}
      </Card.Text>
      <Link className={COMPONENT_IDS.LIST_NONPROFIT_EDIT} to={`/edit/${nonprofit._id}`}>Edit</Link>
    </Card.Body>
  </Card>
);
// Require a document to be passed to this component.
NonprofitItem.propTypes = {
  nonprofit: PropTypeNonprofit.isRequired,
};

export default NonprofitItem;