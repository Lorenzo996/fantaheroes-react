import React, { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { renderPageHeader } from './shared';
import { renderPage } from './shared';
import { sendAPIrequest } from './shared';

const apiUrl = process.env.REACT_APP_API_URL;

function GameEventsPage_New() {
    const [loading, setLoading] = useState(false); // Loading state
    const { gameId } = useParams(); // Get game ID from URL
    const navigate = useNavigate(); // Updated hook

    // Fetch game data from the backend
    const [game, setGame] = useState({});
    useEffect(() => {
        sendAPIrequest(`${apiUrl}/games/${gameId}/`, "GET", "Failed to fetch game", setLoading, {})
            .then((data) => {
                setGame(data); // TODO: check if it possible to replace game with challenges
                setBonuses(data.bonus);
                setMaluses(data.malus);
            }).catch((error) => {
                console.error('Error fetching game rules:', error);
            });
        }, [gameId]);

    // Form state
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [selectedChallenge, setSelectedChallenge] = useState('');
    const [bonuses, setBonuses] = useState([]);
    const [selectedBonus, setSelectedBonus] = useState('');
    const [addedBonuses, setAddedBonuses] = useState([]);
    const [maluses, setMaluses] = useState([]);
    const [selectedMalus, setSelectedMalus] = useState('');
    const [addedMaluses, setAddedMaluses] = useState([]);
    const [points, setPoints] = useState(NaN);
    const [eventNotes, setEventNotes] = useState('');
    const [eventImage, setEventImage] = useState('');

    // Handlers for navigating to different sections
    const handleNavigate = (path) => {
        navigate(path);
    };

    // Handler for changing the selected challenge
    const handleChallengeChanged = async (e) => {
        setSelectedChallenge(e.target.value)
        computePoints(e.target.value, addedBonuses, addedMaluses);
    };
    // Handlers for adding a new event
    const handleAddEvent = async (e) => {
        e.preventDefault(); // Prevent form submission and page reload
        // Ensure that the required fields are filled
        if (!selectedPlayer || !selectedChallenge) {
            alert('Please fill all required fields');
            return;
        }

        // Create a new event object
        // |_ bonus_id: ID of the bonus that was applied
        // |_ bonus_title: Title of the bonus that was applied
        // |_ bonus_description: Description of the bonus that was applied
        // |_ bonus_points: Points of the bonus that was applied
        // |_ malus_id: ID of the malus that was applied
        // |_ malus_title: Title of the malus that was applied
        // |_ malus_description: Description of the malus that was applied
        // |_ malus_points: Points of the malus that was applied
        // |_ event_date: Date and time of the event
        const player = game.players.find((player) => player.id === parseInt(selectedPlayer));
        const challenge = game.challenges.find((challenge) => challenge.id === parseInt(selectedChallenge));


        let new_event = {
            player_id: player.id,
            player_nickname: player.nickname,
            challenge_id: challenge.id,
            challenge_title: challenge.title,
            challenge_description: challenge.description,
            challenge_points: challenge.points,
            bonus_id: addedBonuses.length > 0 ? addedBonuses.slice(0).map(bonus => bonus.id) : null, // list of bonuses id
            bonus_title: addedBonuses.length > 0 ? addedBonuses.slice(0).map(bonus => bonus.title) : null, // list of bonuses title
            bonus_description: addedBonuses.length > 0 ? addedBonuses.slice(0).map(bonus => bonus.description) : null, // list of bonuses description
            bonus_points: addedBonuses.length > 0 ? addedBonuses.slice(0).map(bonus => bonus.points) : null, // list of bonuses points
            bonus_multiplier: addedBonuses.length > 0 ? addedBonuses.slice(0).map(bonus => bonus.multiplier) : null, // list of bonuses multiplier
            malus_id: addedMaluses.length > 0 ? addedMaluses.slice(0).map(malus => malus.id) : null, // list of maluses id
            malus_title: addedMaluses.length > 0 ? addedMaluses.slice(0).map(malus => malus.title) : null, // list of maluses title
            malus_description: addedMaluses.length > 0 ? addedMaluses.slice(0).map(malus => malus.description) : null, // list of maluses description
            malus_points: addedMaluses.length > 0 ? addedMaluses.slice(0).map(malus => malus.points) : null, // list of maluses points
            malus_divider: addedMaluses.length > 0 ? addedMaluses.slice(0).map(malus => malus.divider) : null, // list of maluses divider
            points: points,
            event_date: "2024-aug-12 00:00:00",
            notes: eventNotes,
            image: eventImage,
        };
        
        // Get the image as a base64 string
        if (eventImage !== '') {
            const imageInput = document.getElementById('imageInput');
            const imageFile = imageInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setEventImage(e.target.result);
            };
            reader.onloadend = async (event) => {
                new_event.image = event.target.result;
            }
            reader.readAsDataURL(await fetch(eventImage).then((r) => r.blob()))
        }

        // Send the new event to the backend
        await sendAPIrequest(`${apiUrl}/games/${gameId}/add-event/`, "POST", "Failed to add event", setLoading, JSON.stringify(new_event))

        // Go back to the events page
        navigate(`/game/${gameId}/events/`);
    };
    
    // Handlers for adding and removing bonuses
    const handleAddBonus = (e) => {
        e.preventDefault(); // Prevent form submission and page reload
        if (!selectedBonus) {
            alert('Please select a bonus');
            return;
        }
        const bonus = game.bonus.find((bonus) => bonus.id === parseInt(selectedBonus));
        setAddedBonuses([...addedBonuses, bonus]);
        const newBonuses = bonuses.filter((b) => b.id !== bonus.id);
        if (bonuses.length === 1) {
            setBonuses([]);
        } else {
            setBonuses(newBonuses);
        }
        computePoints(selectedChallenge, [...addedBonuses, bonus], addedMaluses);
        // TODO: update by setting the value of the select element directly to '' (understand how)
        if (newBonuses.length > 0) {
            setSelectedBonus(newBonuses[0].id);
        } else { 
            setSelectedBonus('');
        }

    };
    const handleRemoveBonus = (bonusId) => {
        setAddedBonuses(addedBonuses.filter((bonus) => bonus.id !== bonusId));
        setBonuses([...bonuses, game.bonus.find((bonus) => bonus.id === bonusId)]);
    }

    // Handlers for adding and removing maluses
    const handleAddMalus = (e) => {
        e.preventDefault(); // Prevent form submission and page reload
        if (!selectedMalus) {
            alert('Please select a malus');
            return;
        }
        const malus = game.malus.find((malus) => malus.id === parseInt(selectedMalus));
        setAddedMaluses([...addedMaluses, malus]);
        const newMaluses = maluses.filter((m) => m.id !== malus.id);
        if (maluses.length === 1) {
            setMaluses([]);
        } else {
            setMaluses(newMaluses);
        }
        computePoints(selectedChallenge, addedBonuses, [...addedMaluses, malus]);
        // TODO: update by setting the value of the select element directly to '' (understand how)
        if (newMaluses.length > 0) {
            setSelectedMalus(newMaluses[0].id);
        } else { 
            setSelectedMalus('');
        }
    };
    const handleRemoveMalus = (malusId) => {
        setAddedMaluses(addedMaluses.filter((malus) => malus.id !== malusId));
        setMaluses([...maluses, game.malus.find((malus) => malus.id === malusId)]);
        computePoints(selectedChallenge, addedBonuses, addedMaluses);
    }

    const computePoints = (challenge_id, b, m) => {
        if (challenge_id === '') {
            setPoints(NaN);
            return;
        }
        // get the challenge
        const challenge = game.challenges.find((challenge) => challenge.id === parseInt(challenge_id));
        // Compute points from the challenge
        let p = challenge.points;
        // Compute points from bonuses multipliers and dividers
        let factor = 1;
        let extra_points = 0;
        for (let i = 0; i < b.length; i++) {
            factor *= b[i].multiplier;
            extra_points += b[i].points;
        }
        for (let i = 0; i < m.length; i++) {
            factor /= m[i].divider;
            extra_points += m[i].points; // Points already negative
        }   
        p *= factor; // Apply the factor to the challenge points
        p += extra_points; // Add the extra points from bonuses and maluses
        setPoints(p);

    }
    // Render the page
    const renderPageContent = () => {
        return (
            <>
                {/* Form to add a new event */}
                <form>
                    {/* Players drop down */}
                    <label className="form-label">Player:</label>
                        <select className="form-input-select" value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
                            <option value="" disabled>Select a player</option>
                            {game.players && game.players.map((player) => (
                                <option key={`player-${player.id}`} value={player.id}>
                                    {player.nickname}
                                </option>
                            ))}
                        </select>
                    <br />

                    {/* Challenges drop down */}
                    <label className="form-label">Challenge:</label>
                        <select className="form-input-select" value={selectedChallenge} onChange={handleChallengeChanged}>
                            <option value="" disabled>Select a challenge</option>
                            {game.challenges && game.challenges.map((challenge) => (
                                <option key={`challenge-${challenge.id}`} value={challenge.id}>
                                    {challenge.title}
                                </option>
                            ))}
                        </select>
                    <br />

                    {/* Bonus drop down with add button and list of added bonuses*/}
                    <label className="form-label">Bonus:</label>
                        <select className="form-input-select" value={selectedBonus} onChange={(e) => setSelectedBonus(e.target.value)}>
                            <option value="" disabled>Select a bonus</option>
                            {bonuses && bonuses.map((bonus) => (
                                <option key={`bonus-${bonus.id}`} value={bonus.id}>
                                    {bonus.title}
                                </option>
                            ))}
                        </select>
                        <button className="add-remove-button" onClick={handleAddBonus}>
                            +
                        </button>
                    <br />
                    <ul>
                        {addedBonuses.map((bonus) => (
                            <li key={`added-bonus-${bonus.id}`} className="text">
                                {bonus.title}
                                <button className="add-remove-button" onClick={() => handleRemoveBonus(bonus.id)}>
                                    -
                                </button>
                            </li>
                        ))}
                    </ul>
                        
                    {/* Malus drop down with add button and list of added maluses*/}
                    <label className="form-label">Malus:</label>
                        <select className="form-input-select" value={selectedMalus} onChange={(e) => setSelectedMalus(e.target.value)}>
                            <option value="" disabled>Select a malus</option>
                            {maluses && maluses.map((malus) => (
                                <option key={`malus-${malus.id}`} value={malus.id}>
                                    {malus.title}
                                </option>
                            ))}
                        </select>
                        <button className="add-remove-button" onClick={handleAddMalus}>
                            +
                        </button>
                    <br />
                    <ul>
                        {addedMaluses.map((malus) => (
                            <li key={`added-malus-${malus.id}`} className="text">
                                {malus.title}
                                <button className="remove-button" onClick={() => handleRemoveMalus(malus.id)}>
                                    -
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Notes and attach image (optional) */}
                    <label className="form-label">Notes:</label>
                    <textarea className="form-input" placeholder="Enter notes here" value={eventNotes} onChange={(e) => setEventNotes(e.target.value)}></textarea>
                    <br />
                    <label className="form-label">Attach image:</label>
                    {eventImage == "" ? (
                        <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            onChange={(e) => setEventImage(URL.createObjectURL(e.target.files[0]))}
                        />
                    ) : (
                        <div>
                            <img src={eventImage} className="edit-settings-image" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                            <input
                                type="file"
                                id="imageInput"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => setEventImage(URL.createObjectURL(e.target.files[0]))}
                            />
                            <button className="edit-settings-image-button" onClick={() => setEventImage("")}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    )}
                    <br />

                    {/* Submit button */}
                </form>
                <br />
                <br />
                
                {/* Points */}
                <p className="form-label">Points: <span className="text">{isNaN(points) ? '-' : points}</span></p>

                {/* Add event button */}
                <button className="add-button" onClick={handleAddEvent}>
                    Add Event
                </button>
            </>
        );
    }

    return (
        renderPage("New event", `/game/${gameId}/events`, "Events", handleNavigate, renderPageContent(), loading)        
    );
}

export default GameEventsPage_New;
