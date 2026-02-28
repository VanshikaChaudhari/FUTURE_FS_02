import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // All Hooks must be inside the function
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getLeads = () => {
    axios.get('http://localhost:5000/leads')
      .then(res => setLeads(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    getLeads();
  }, []);

  const updateLead = (id, updatedData) => {
    axios.put(`http://localhost:5000/leads/${id}`, updatedData)
      .then(() => getLeads())
      .catch(err => console.error("Update failed:", err));
  };
  
  const [formData, setFormData] = useState({ name: '', email: '' });

const addLead = (e) => {
  e.preventDefault();
  axios.post('http://localhost:5000/leads', formData)
    .then(() => {
      getLeads(); // Refresh the list
      setFormData({ name: '', email: '' }); // Clear the form
    });
};

  return (
    <div className="App">
      <h1>Mini CRM - Lead Management</h1>
      
      {/* Step 3: Search Bar */}

      <form onSubmit={addLead} style={{ marginBottom: '30px' }}>
  <input 
    placeholder="Name" 
    value={formData.name} 
    onChange={(e) => setFormData({...formData, name: e.target.value})} 
    required 
  />
  <input 
    placeholder="Email" 
    value={formData.email} 
    onChange={(e) => setFormData({...formData, email: e.target.value})} 
    required 
  />
  <button type="submit">Add Lead</button>
</form>

      <input 
        type="text" 
        placeholder="Search leads..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ margin: '20px', padding: '10px', width: '300px' }}
      />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {leads
            .filter(lead => lead.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(lead => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>
                  <select 
                    value={lead.status} 
                    onChange={(e) => updateLead(lead._id, { status: e.target.value })}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </td>
                <td>
                  <input 
                    type="text" 
                    defaultValue={lead.notes} 
                    onBlur={(e) => updateLead(lead._id, { notes: e.target.value })}
                  />
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;