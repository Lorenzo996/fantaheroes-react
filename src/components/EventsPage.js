import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

function EventsPage() {
  const [events, setEvents] = useState(['Event 1', 'Event 2', 'Event 3']);

  const renderEventCards = (events) => {
    return events.map((event, index) => (
      <Card key={index} style={{ marginBottom: '10px' }}>
        <Card.Header className='expandable-card-header' onClick={() => toggleCard(index)}>
          {event}
        </Card.Header>
        <Card.Body style={{ display: 'none' }}>
          <p>Details about {event}</p>
        </Card.Body>
      </Card>
    ));
  };

  const toggleCard = (index) => {
    const cardBody = document.querySelectorAll('.card-body')[index];
    if (cardBody.style.display === 'none') {
      cardBody.style.display = 'block';
    } else {
      cardBody.style.display = 'none';
    }
  };

  return (
    <div className="container">
      <h2>Events</h2>
      {renderEventCards(events)}
    </div>
  );
}

export default EventsPage;
