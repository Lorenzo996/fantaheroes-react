import React, { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Dropdown, ButtonGroup, Button, DropdownButton } from 'react-bootstrap';
import { renderPageHeader } from './shared';
import { renderPage } from './shared';
import { sendAPIrequest } from './shared';
import { toggleCard } from './shared';


const apiUrl = process.env.REACT_APP_API_URL;

function GameEventsPage() {
    const [loading, setLoading] = useState(false); // Loading state
    const { gameId } = useParams(); // Get game ID from URL
    const [activeKey, setActiveKey] = useState('0'); // Active key for the accordion
    const navigate = useNavigate(); // Updated hook
    
    // Fetch game events from the backend
    const [events, setEvents] = useState([]); // Initialize players state with an empty object
    useEffect(() => {
        sendAPIrequest(`${apiUrl}/games/${gameId}/events/`, "GET", "Failed to fetch game events", setLoading, {})
        .then((data) => {
            setEvents(data);
        })
        .catch((error) => {
            console.error('Error fetching game events:', error);
        });
        }, [gameId]); // TODO: is it necessary to include gameId in the dependencies?
    
    // Handlers for navigating to different sections
    const handleNavigate = (path) => {
        navigate(path);
    };

    // Handler for editing an event
    const handleEdit = (item, tabName) => {
        console.log(`Editing ${item} in ${tabName}`);
    };
    // Handler for deleting an event
    const handleDelete = async (item) => {
        // try {
            const response = await fetch(`${apiUrl}/games/${gameId}/delete-event/${item.id}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.error('Failed to delete event');
            }

            // After deleting, update the events state locally
            setEvents(events.filter((event) => event.id !== item.id));
        // } catch (error) {
        //   console.error('Error deleting rule:', error);
        // }
};


    // Render the events list
    const renderEvents = () => {
        if (events.length === 0) {
            return <p>No events found</p>;
        }
        events.reverse(); // reverse events to show the most recent first
        return events.map((event) => {
            return (
              <Card key={event.id} className="expandable-card">
                <Card.Header className="expandable-card-header">
                    {/* Title that can toggle the card body */}
                    <span onClick={() => toggleCard(event.id)} className="expandable-card-title" >
                        {event.challenge_title} [{event.player_nickname}]
                    </span>

                    {/* Menu button with Edit and Delete options */}
                    <Dropdown>
                        <Dropdown.Toggle
                            as="button" // Override default button
                            className="expandable-card-header-menu-button"
                        >
                            &#x22EE; {/* Unicode for vertical ellipsis (⋮) */}
                        </Dropdown.Toggle>

                        <Dropdown.Menu align="end">
                            <Dropdown.Item onClick={() => handleEdit(event)}>Edit</Dropdown.Item>
                            {/* <Dropdown.Item onClick={() => handleDelete(event)}>Delete</Dropdown.Item> */}
                        </Dropdown.Menu>
                    </Dropdown>

                </Card.Header>
        
                <Card.Body id={`card-body-${event.id}`} className="expandable-card-body">
                    {/* Description */}
                    <p className="text">{event.challenge_description}</p>
                    {/* Points */}
                    <p className="text">Points: {event.points}</p>

                    {/* Notes (optional) */}
                    {event.notes && <p className="text">Notes: {event.notes}</p>}

                    {/* Image (optional) */}
                    {event.image && <img src={event.image} alt="Event" className="expandable-card-image" />}
                    {/* Date */}
                    <p className="text">Date: {event.event_date}</p>

                </Card.Body>
              </Card>
            );
          });
    }
    
    const renderPageContent = () => {
        return (
          <>
            {/* Add event button */}
            <button className="top-right-add-button" onClick={() => handleNavigate(`/game/${gameId}/events/new`)}>
                Add Event
            </button>
            {/* Events list */}
            {renderEvents()}
          </>
        )
      }
    // Render the page
    return (
        renderPage("Events", `/game/${gameId}`, "Dashboard", handleNavigate, renderPageContent(), loading)
    );
}

export default GameEventsPage;
