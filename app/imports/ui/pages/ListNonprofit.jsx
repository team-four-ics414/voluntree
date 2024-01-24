import React from 'react';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Nonprofits } from '../../api/nonprofit/NonprofitCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import LoadingSpinner from '../components/LoadingSpinner';
import NonprofitItem from '../components/NonprofitItem';

/* Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListNonprofit = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, nonprofits } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Nonprofits.subscribeNonprofit();
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const nonprofitItems = Nonprofits.find({}).fetch();
    return {
      nonprofits: nonprofitItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container id={PAGE_IDS.LIST_NONPROFIT} className="py-3">
      <Button href="/add-nonprofit">Add Nonprofit</Button>
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>Nonprofits Dashboard</h2>
          </Col>
        </Col>
      </Row>
      <Row xs={1} md={2} lg={3} className="g-4">
        {nonprofits.map((nonprofit) => <Col key={nonprofit._id}><NonprofitItem nonprofit={nonprofit} /></Col>)}
      </Row>
    </Container>
  ) : <LoadingSpinner message="Loading Nonprofits" />);
};

export default ListNonprofit;
