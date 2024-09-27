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
                &lt; {title} {/* Arrow icon for going back */}
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

export const sendAPIrequest = async ( path, method, errorMsg, setLoading ) => {
    setLoading(true); // Start loading before the request is sent
    let headers = { 'Authorization': `Token ${localStorage.getItem('token')}` };
    if (method === 'POST') {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(`${path}`, {
            method: method,
            headers: headers,
        });

        setLoading(false); // Stop loading once the response is received
        await response.json()
        console.log(response);
        if (!response.ok) {
            throw new Error(errorMsg);
        }
        
        return response;

    } catch (error) {
        setLoading(false); // Stop loading on error

        console.error('Error sending API request:', error);

    }

}