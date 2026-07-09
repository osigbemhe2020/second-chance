import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { urlConfig } from "../../config"
import { useAppContext } from '../../context/AppContext';

function ItemPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Living');
    const [condition, setCondition] = useState('New');
    const [zipcode, setZipcode] = useState('10110');
    const [age_days, setAge_days] = useState(0);
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState(null);
    const { isLoggedIn } = useAppContext();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/app/login')
        }
    });

    const handleAddItem = async () => {

      // Get the form data
      const formData = new FormData();
      const file = document.getElementById('file').files[0];
      formData.append('file', file);
      formData.append('name', document.getElementById('name').value);
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('zipcode', document.getElementById('zipcode').value);
      let age_days = document.getElementById('age_days').value;
      formData.append('age_days', age_days);
      formData.append('age_years', (age_days/365).toFixed(2));
      formData.append('description', document.getElementById('description').value);
      formData.append('image', `/images/${file.name}`);
      formData.append('comments', []);

          try {
            let url = `${urlConfig.backendUrl}/api/secondchance/items`;
            console.log(url);
              const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
    
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              const data = await response.json();
              if(data){
                setMessage("Item added!")
                setTimeout(() => {
                    setMessage("")
                    navigate("/");
                }, 500);
              }
          } catch (error) {
            setMessage(error.message);
          }
  }

    return (
      <div className="container mt-5">
      <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
              <div className="register-card p-5 border rounded">
                  <h2 className="text-center mb-4 font-weight-bold">Add New Item</h2>
                  
                  <div className="mb-4">
                      <label htmlFor="name" className="form-label">Item Name</label>
                      <input
                          id="name"
                          type="text"
                          className="form-control"
                          placeholder="e.g. Vintage Study Lamp"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                      />
                  </div>

                  <div className="row mb-4">
                      <div className="col-md-6">
                          <label htmlFor="category" className="form-label">Category</label>
                          <select id="category" className="form-control" onChange={(e) => setCategory(e.target.value)}>
                              <option key="Living" value="Living">Living</option>
                              <option key="Bedroom" value="Bedroom">Bedroom</option>
                              <option key="Bathroom" value="Bathroom">Bathroom</option>
                              <option key="Kitchen" value="Kitchen">Kitchen</option>
                              <option key="Office" value="Office">Office</option>
                          </select>
                      </div>
                      <div className="col-md-6">
                          <label htmlFor="condition" className="form-label">Condition</label>
                          <select id="condition" className="form-control" onChange={(e) => setCondition(e.target.value)}>
                              <option key="New" value="New">New</option>
                              <option key="Like New" value="Like New">Like New</option>
                              <option key="Older" value="Older">Older</option>
                          </select>
                      </div>
                  </div>

                  <div className="row mb-4">
                      <div className="col-md-6">
                          <label htmlFor="zipcode" className="form-label">Zipcode</label>
                          <input
                              id="zipcode"
                              type="text"
                              className="form-control"
                              placeholder="e.g. 10110"
                              value={zipcode}
                              onChange={(e) => setZipcode(e.target.value)}
                          />
                      </div>
                      <div className="col-md-6">
                          <label htmlFor="age_days" className="form-label">Age (in days)</label>
                          <input
                              id="age_days"
                              type="number"
                              className="form-control"
                              placeholder="e.g. 120"
                              value={age_days}
                              onChange={(e) => setAge_days(e.target.value)}
                          />
                      </div>
                  </div>

                  <div className="mb-4">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea
                          id="description"
                          rows="4"
                          className="form-control"
                          placeholder="Describe the item's condition, dimensions, color..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                      />
                  </div>

                  <div className="mb-4">
                      <label className="form-label">Item Photo</label>
                      <input style={{display: 'block'}} type="file" id="file" name="file" accept=".jpg, .png, .gif"/>
                  </div>

                  <button className="btn btn-primary w-100 mb-3" onClick={handleAddItem}>Add Item</button>

                  <span style={{color:'var(--success)',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'14px',fontWeight:'500'}}>{message}</span>

              </div>
          </div>
      </div>
  </div>      
    );
}

export default ItemPage;
