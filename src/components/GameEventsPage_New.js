import React, { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;

function GameEventsPage_New() {
    const { gameId } = useParams(); // Get game ID from URL
    const navigate = useNavigate(); // Updated hook

    // Fetch game data from the backend
    const [game, setGame] = useState({});
    useEffect(() => {
        fetchGameRules()
            .then((data) => {
                setGame(data); // TODO: check if it possible to replace game with challenges
                setBonuses(data.bonus);
                setMaluses(data.malus);
            }).catch((error) => {
                console.error('Error fetching game rules:', error);
            });
        }, [gameId]);
    const fetchGameRules = async () => {
    // try {
        const response = await fetch(`${apiUrl}/games/${gameId}/`, {
            headers: {'Authorization': `Token ${localStorage.getItem('token')}`},
        });
        const data = await response.json();
        return data;
    // } catch (error) {
    //   throw new Error('Failed to fetch game rules');
    // }
    };


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
        const new_event = {
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
        };
        
        // Send the new event to the backend
        const response = await fetch(`${apiUrl}/games/${gameId}/add-event/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(new_event),
        });
        if (!response.ok) {
            console.error('Failed to add event');
            return;
        }

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
        console.log(b);
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
        console.log(p, factor, extra_points);
        setPoints(p);

    }
    // Render the page
    return (
        <div className="page-layout">
            {/* Page header */}
            <div className="page-header">
                <button className="back-button" onClick={() => handleNavigate(`/game/${gameId}/events`)}>
                    &lt; Events {/* Arrow icon for going back */}
                </button>
            </div>

            {/* Main Content*/}
            <div className="page-content">
                <h1 className="page-content-title">New event</h1>
                {/* Form to add a new event */}
                <form>
                    {/* Players drop down */}
                    <label className="form-label">Player:</label>
                        <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
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
                        <select value={selectedChallenge} onChange={handleChallengeChanged}>
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
                        <select value={selectedBonus} onChange={(e) => setSelectedBonus(e.target.value)}>
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
                        <select value={selectedMalus} onChange={(e) => setSelectedMalus(e.target.value)}>
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


                </form>
                {/* Points */}
                <p className="text">Points: {points}</p>

                {/* Add event button */}
                <button className="add-button" onClick={handleAddEvent}>
                    Add Event
                </button>
            </div>
        </div>
    );
}

export default GameEventsPage_New;
