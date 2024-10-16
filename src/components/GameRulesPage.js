import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Dropdown, ButtonGroup, Button, DropdownButton } from 'react-bootstrap';
import { tab } from '@testing-library/user-event/dist/tab';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { toggleCard, renderPageHeader } from './shared';
import { renderPage } from './shared';
import { sendAPIrequest } from './shared';

const apiUrl = process.env.REACT_APP_API_URL;

function GameRulesPage() {
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  // Get game ID from URL
  const { gameId } = useParams();

  // Get game rules from the backend (challenges)
  const [challenges, setChallenges] = useState([]);
  const [bonus, setBonus] = useState([]);
  const [malus, setMalus] = useState([]);

  // Track the active tab (challenges, bonus, or malus)
  const [activeTab, setActiveTab] = useState('challenges');
  
  // State to track which card is being edited
  const [editMode, setEditMode] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPoints, setEditedPoints] = useState(0);
  const [editedMultiplier, setEditedMultiplier] = useState(1);
  const [editedDivider, setEditedDivider] = useState(1);

  // Fetch game rules from the backend
  useEffect(() => {
    sendAPIrequest(`${apiUrl}games/${gameId}/rules/`, "GET", "Failed to fetch game rules", setLoading, {})
    .then((data) => {
        setChallenges(data["challenges"]);
        setBonus(data["bonus"]);
        setMalus(data["malus"]);
      })
      .catch((error) => {
        console.error('Error fetching game rules:', error);
      });
    }, [gameId]);


  // Function to render cards
  const renderCards = (items, tabName) => {
    return items.map((item, index) => {
      // Standard card for existing rule
      const uniqueIndex = `${tabName}-${index}`; // Create a unique index for each card
      let isEditing = editMode === uniqueIndex; // Check if this card is in edit mode
      // Editable card for new rule
      let isNew = false;
      if (item.isNew) {
        isEditing = true;
        isNew = true;
      }
      return (
        <Card key={uniqueIndex} className="expandable-card">
          <Card.Header className="expandable-card-header">
            {/* Title that can toggle the card body */}
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                placeholder='Title'
                onChange={(e) => setEditedTitle(e.target.value)}
                className="form-input"
                style={{ flexGrow: 1 }}
              />
            ) : (
              <span onClick={() => toggleCard(uniqueIndex)} className="expandable-card-title">
                {item.title}
              </span>
            )}

            {/* Save and cancel button when in edit mode */}
            {isEditing && (
              <div style={{display: 'flex', marginLeft:'10px'}}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSaveEdit(index, item.id, tabName, isNew)}
                  style={{
                    backgroundColor: '#28a745',  // Modern green for save
                    border: 'none',
                    borderRadius: '50%',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    padding: '10px',
                    marginRight: '10px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <i className="fas fa-check" style={{ color: '#fff', fontSize: '16px' }}></i>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleCancelEdit(index, item.id, tabName, isNew)}
                  style={{
                    backgroundColor: '#dc3545',  // Modern red for cancel
                    border: 'none',
                    borderRadius: '50%',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    padding: '10px',
                    marginRight: '10px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <i className="fas fa-times" style={{ color: '#fff', fontSize: '16px' }}></i>
                </Button>
              </div>
            )}

            {/* Menu button with Edit and Delete options */}
            <Dropdown>
              <Dropdown.Toggle
                as="button" // Override default button
                id={`dropdown-${uniqueIndex}`} // TODO: verify if this is necessary
                className="expandable-card-header-menu-button"
              >
                &#x22EE; {/* Unicode for vertical ellipsis (⋮) */}
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => handleEdit(item, uniqueIndex)}>Edit</Dropdown.Item>
                <Dropdown.Item onClick={() => handleDelete(item, tabName)}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
  
          </Card.Header>
  
          <Card.Body id={`card-body-${uniqueIndex}`} className="expandable-card-body" style={isNew ? { display: 'block' } : {}}>
            {/* Description */}
            {isEditing ? (
              <textarea
                value={editedDescription}
                placeholder="Description"
                onChange={(e) => setEditedDescription(e.target.value)}
                className="form-input"
                style={{ width: '100%' }}
              />
            ) : (
              <p className="text">{item.description}</p>
            )}

            {/* Points */}
            {tabName === 'challenges' ? (
              isEditing ? (
                <div>
                  <span className="text">Points:</span>
                  <input type="number" value={editedPoints} onChange={(e) => setEditedPoints(e.target.value)} max={100} min={-100} className="form-input" style={{width:'70px', borderColor:'transparent'}}/>
                </div>
              ) : (
                <p className="text">Points: {item.points}</p>
              )
            ) : (tabName === 'bonus' && ((item.points > 0 && item.multiplier === 1) || (item.points === 0 && item.multiplier === 1) || isEditing) ? (
                isEditing ? (
                  <div>
                    <span className="text">Points:</span>
                    <input type="number" value={editedPoints} onChange={(e) => { setEditedPoints(e.target.value); setEditedMultiplier(1); }} max={100} min={-100} className="form-input-number-70"/>
                  </div>
                ) : (
                  <span className="text">Points: {item.points}</span>
                )
              ) : (tabName === 'malus' && ((item.points < 0 && item.divider === 1) || (item.points === 0 && item.divider === 1) || isEditing) ? (
                  isEditing ? (
                    <div>
                      <span className="text">Points:</span>
                      <input type="number" value={editedPoints} onChange={(e) => (setEditedPoints(e.target.value), setEditedDivider(1))} max={100} min={-100} className="form-input" style={{width:'70px', borderColor:'transparent'}}/>
                    </div>
                  ) : (
                    <p className="text">Points: {item.points}</p>
                  )
                ) : (
                  <></>
                )
              )
            )}

    
            {/* multiplier */}
            {tabName === 'bonus' && isEditing ? (
              <div>
                <span className="text">Multiplier: </span>
                <input type="number" value={editedMultiplier} onChange={(e) => (setEditedMultiplier(e.target.value), setEditedPoints(0))} max={5} min={1} className="form-input" style={{width:'70px', borderColor:'transparent'}}/>
              </div>
            ) : ( tabName === 'bonus' && item.points === 0 && item.multiplier > 1 ? (
                <p className="text">Multiplier: {item.multiplier}</p>
              ) : (
                <></>
              )
            )}

            {/* divider */}
            {tabName === 'malus' && isEditing ? (
              <div>
                <span className="text">Divider: </span>
                <input type="number" value={editedDivider} onChange={(e) => (setEditedDivider(e.target.value), setEditedPoints(0))} max={5} min={1} className="form-input" style={{width:'70px', borderColor:'transparent'}}/>
              </div>
            ) : ( tabName === 'malus' && item.points === 0 && item.divider > 1 ? (
                <p className="text">Divider: {item.divider}</p>
              ) : (
                <></>
              )
            )}


          </Card.Body>

        </Card>
      );
    });
  };


  // Function to render the Add Rule button
  const renderAddRuleButton = (type) => {
    return (
      <Button
        variant="success"
        onClick={() => handleAddRule(type)}
        style={{ marginTop: '10px' }}
      >
        Add {type}
      </Button>
    );
  };

  // Function for Edit functionality
  const handleEdit = (item, uniqueIndex) => {
    // Set this card to edit mode
    setEditMode(uniqueIndex);
    // Set current title and description in state (i.e., store original values)
    setEditedTitle(item.title);
    setEditedDescription(item.description);
    setEditedPoints(item.points);
    setEditedMultiplier(item.multiplier);
    setEditedDivider(item.divider);
  };

  // Function for Save (edited rule) functionality
  const handleSaveEdit = async (ruleIdx, ruleId, type, isNew) => {
    // try {
      let updatedRule = {
        title: editedTitle,
        description: editedDescription,
        points: editedPoints,
      };
      if (type === 'bonus') {
        updatedRule["multiplier"] = editedMultiplier;
      } else if (type === 'malus') {
        updatedRule["divider"] = editedDivider;
      }

      let url = `${apiUrl}games/${gameId}/edit-${type}/${ruleId}/`;
      if (isNew === true) {
        url = `${apiUrl}games/${gameId}/add-${type}/`; // Use a different URL for new rules
      }
      const data = await sendAPIrequest(url, "POST", "Failed to save changes", setLoading, JSON.stringify(updatedRule));

      if (isNew === true) {
        ruleId = data; // Get the new rule ID from the response
      }
      updatedRule['id'] = ruleId;

      // After saving, update the state locally
      if (type === 'challenges') {
        let updatedChallenges = [...challenges];
        updatedChallenges[ruleIdx] = updatedRule;
        setChallenges(updatedChallenges);
      } else if (type === 'bonus') {
        let updatedBonus = [...bonus];
        updatedBonus[ruleIdx] = updatedRule;
        setBonus(updatedBonus);
      } else if (type === 'malus') {
        let updatedMalus = [...malus];
        updatedMalus[ruleIdx] = updatedRule;
        setMalus(updatedMalus);
      }
      
      // window.location.reload(); // Refresh the page to get the updated rules

      // Exit edit mode
      setEditMode(null);
  };
  
  const handleCancelEdit = (ruleIdx, ruleId, type, isNew) => {
    // If this was a existing rule, revert the changes
    if (!isNew) {
      const originalRule = challenges[ruleIdx];
      setEditedTitle(originalRule.title);
      setEditedDescription(originalRule.description);
      setEditedPoints(originalRule.points);
    }
    // Exit edit mode
    setEditMode(null);
  };
  

  // Function for Delete functionality
  const handleDelete = async (item, type) => {
    await sendAPIrequest(`${apiUrl}games/${gameId}/delete-${type}/${item["id"]}/`, "POST", "Failed to delete rule", setLoading, {})

    // After deleting, update the state locally
    const updatedChallenges = challenges.filter((challenge) => challenge.id !== item.id);
    setChallenges(updatedChallenges);
  };

  // Function for Add Rule functionality
  const handleAddRule = (type) => {
    const newRule = {
      title: '',
      description: '',
      points: 0,
      isNew: true, // Mark as new so we can show editable fields
    };

    if (type === 'challenges') {
      setChallenges([...challenges, newRule]);
    } else if (type === 'bonus') {
      setBonus([...bonus, newRule]);
    } else if (type === 'malus') {
      setMalus([...malus, newRule]);
    }
    setEditedTitle('');
    setEditedDescription('');
    setEditedPoints(0);
    setEditedMultiplier(1);
    setEditedDivider(1);
  };


  // Handlers for navigating to different sections
  const handleNavigate = (path) => {
    navigate(path);
  };

  const renderPageContent = () => {
    return (
      <>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} id="game-rules-tabs">
          <Tab eventKey="challenges" title="Challenges" id="challenges-tab">
            {renderCards(challenges, 'challenges')}
            {renderAddRuleButton('challenges')}
          </Tab>
          <Tab eventKey="bonus" title="Bonus" id="bonus-tab">
            {renderCards(bonus, 'bonus')}
            {renderAddRuleButton('bonus')}
          </Tab>
          <Tab eventKey="malus" title="Malus" id="malus-tab">
            {renderCards(malus, 'malus')}
            {renderAddRuleButton('malus')}
          </Tab>
        </Tabs>
      </>
    );
  };
        

  return (
    renderPage("Game Rules", `/game/${gameId}`, "Dashboard", handleNavigate, renderPageContent(), loading)        
  );
}

export default GameRulesPage;
