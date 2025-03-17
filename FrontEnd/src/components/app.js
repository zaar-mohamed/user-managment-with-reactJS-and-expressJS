

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3010'; 

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailswindow, setdetailswindow] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', age: '' });



  
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
      setdetailswindow(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
    }
  };

  
  const addUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users`, newUser);
      setNewUser({ name: '', email: '', age: '' });
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


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestion des Utilisateurs</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          {showForm ? 'Annuler' : 'Ajouter un utilisateur'}
        </button>
      </header>

      {/* add form */}
      {showForm && (
        <div className="form-container">
          <h2>Ajouter un utilisateur</h2>
          <form onSubmit={addUser}>
            <div className="form-group">
              <label>Nom:</label>
              <input type="text" name="name"  value={newUser.name} onChange={handleInputChange} required/>
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email"  value={newUser.email} onChange={handleInputChange} required/>
            </div>
            <div className="form-group">
              <label>Âge:</label>
              <input type="number" name="age"  value={newUser.age} onChange={handleInputChange}/>
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

      {/* Fenêtre  pour afficher les détails d'un utilisateur */}
      {detailswindow && selectedUser && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Détails de l'utilisateur</h2>
            <div className="user-details">
              <p><strong>ID:</strong> {selectedUser._id}</p>
              <p><strong>Nom:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Âge:</strong> {selectedUser.age}</p>
              <p><strong>Créé le:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => setdetailswindow(false)} className="close-button">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;