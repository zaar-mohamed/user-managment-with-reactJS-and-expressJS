import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000'; 

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailspop, setdetailspop] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur :', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUserDetails = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      setSelectedUser(response.data);
      setdetailspop(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users`, { name, email, age });
      setName('');
      setEmail('');
      setAge('');
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      console.error('Erreur :', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestion des Utilisateurs</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          {showForm ? 'Annuler' : 'Ajouter un utilisateur'}
        </button>
      </header>

      {/* Add form */}
      {showForm && (
        <div className="form-container">
          <h2>Ajouter un utilisateur</h2>
          <form onSubmit={addUser}>
            <div className="form-group">
              <label>Nom:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Âge:</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <button type="submit" className="submit-button">Enregistrer</button>
          </form>
        </div>
      )}

      <div className="users-container">
        <h2>Liste des Utilisateurs</h2>
        {users.length === 0 ? (
          <p>Aucun utilisateur trouvé</p>
        ) : (
          <ul className="users-list">
            {users.map(user => (
              <li key={user._id} className="user-item">
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                </div>
                <div className="user-actions">
                  <button onClick={() => fetchUserDetails(user._id)} className="detail-button">
                    Détails
                  </button>
                  <button onClick={() => deleteUser(user._id)} className="delete-button">
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Display user details */}
      {detailspop && selectedUser && (
        <div className="detail-pop">
          <div className="detail-content">
            <h2>Détails de l'utilisateur</h2>
            <div className="user-details">
              <p><strong>ID:</strong> {selectedUser._id}</p>
              <p><strong>Nom:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Âge:</strong> {selectedUser.age}</p>
              <p><strong>Créé le:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => setdetailspop(false)} className="close-button">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;