import { Card } from 'react-bootstrap';

// Function to expand or collapse the card body
export const toggleCard = (uniqueIndex) => {
    const cardBody = document.getElementById(`card-body-${uniqueIndex}`);
    if (cardBody.style.display === 'none' || cardBody.style.display === '') {
        cardBody.style.display = 'block';
    } else {
        cardBody.style.display = 'none';
    }
};



// Edit the game settings in the backend
export const setEditedGameSettings = async (apiUrl, gameId, setGameSettings, value, key) => {
    // Send the updated value to the backend
    fetch(`${apiUrl}/games/${gameId}/edit-settings/${key}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`, // Send token in header
        },
        body: JSON.stringify({ [key]: value }),
    });

    // Update the game state with the new value
    setGameSettings((prevGame) => {
        return {
            ...prevGame,
            [key]: value,
        };
    });
};


export const fetchGameSettings = async (apiUrl, gameId) => {
    // try {
        const response = await fetch(`${apiUrl}/games/${gameId}/settings`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`, // Send token in header
            },
          });
        const data = await response.json();
        return data;
    // } catch (error) {
    //   throw new Error('Failed to fetch game settings');
    // }
};


export const renderGameSettingsCard = (cards, gameSettings, setGameSettings, apiUrl, gameId) => {
    console.log(gameSettings);
    return cards.map((card, index) => (
        <Card key={`${card.title}-card`} className="expandable-card">
            <Card.Header className="expandable-card-header">
                <span onClick={() => toggleCard(card.title)} className="expandable-card-title" >{card.title} </span>
            </Card.Header>
            <Card.Body id={`card-body-${card.title}`} className="expandable-card-body">
                {card.fields.map((field, index) => (
                    <div key={index}>
                        <span className="form-label">{field.label}</span>
                        {field.type === "number" ? (
                            <input type="number" 
                            className="form-input-number-70" 
                            value={gameSettings[field.key] || ''} 
                            onChange={(e) => setEditedGameSettings(apiUrl, gameId, setGameSettings, e.target.value, field.key)}
                            />
                        ) : (field.type === "duration" ? (
                            <input type = "time"
                            className="form-input-duration"
                            value={gameSettings[field.key] || ''}
                            max="96:00" required
                            onChange={(e) => setEditedGameSettings(apiUrl, gameId, setGameSettings, e.target.value, field.key)}
                            />
                        ) :(field.type === "datetime" ? (
                            <input type="datetime-local" 
                            className="form-input-datetime" 
                            value={gameSettings[field.key] || ''} 
                            onChange={(e) => setEditedGameSettings(apiUrl, gameId, setGameSettings, e.target.value, field.key)}
                            />
                        ) : (
                            <input type="text" 
                            className="form-input-text" 
                            value={gameSettings[field.key] || ''} 
                            onChange={(e) => setEditedGameSettings(apiUrl, gameId, setGameSettings, e.target.value, field.key)}
                            />
                        )))}
                    </div>
                ))}
            </Card.Body>
        </Card>
    ));
}


export const renderPageHeader = (title, backPath, handleNavigate) => {
    return (
        <div className="page-header">
            <button className="back-button" onClick={() => handleNavigate(backPath)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="white" className="bi bi-arrow-left" viewBox="0 0 18 18">
                    <path fillRule="evenodd" d="M11.354 4.354a.5.5 0 0 1 0 .708L7.707 8l3.647 3.646a.5.5 0 0 1-0.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0z"/>
                </svg>
                <span className="text" style={{marginLeft:'10px'}}>{title}</span>
            </button>
        </div>
    );
}

export const renderLoadingMask = () => {
    return (
        <div className="loading-mask">
            <div className="loading-spinner"></div>
        </div>
    );
}

export const sendAPIrequest = async (path, method, errorMsg, setLoading, data = null) => {
    setLoading(true); // Start loading before the request is sent
    let headers = { 'Authorization': `Token ${localStorage.getItem('token')}` };
    if (method === 'POST') {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(`${path}`, {
            method: method,
            headers: headers,
            body: data ? JSON.stringify(data) : null,
        });

        setLoading(false); // Stop loading once the response is received
        const responseData = await response.json();
        console.log(responseData);
        if (!response.ok) {
            throw new Error(errorMsg);
        }
        
        return responseData;

    } catch (error) {
        setLoading(false); // Stop loading on error

        console.error('Error sending API request:', error);

    }
}