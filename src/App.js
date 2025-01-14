import React, { useState, useEffect } from 'react';
import './App.css';

const LIST_API_URL = 'https://api.example.com/lists'; // Replace with actual API URL

const App = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedLists, setSelectedLists] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newList, setNewList] = useState([]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(LIST_API_URL);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setLists(data.lists);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleListSelection = (listNumber) => {
    if (selectedLists.includes(listNumber)) {
      setSelectedLists(selectedLists.filter((num) => num !== listNumber));
    } else {
      if (selectedLists.length < 2) {
        setSelectedLists([...selectedLists, listNumber]);
      }
    }
  };

  const handleCreateNewList = () => {
    if (selectedLists.length !== 2) {
      alert('You should select exactly 2 lists to create a new list');
      return;
    }
    setIsCreating(true);
  };

  const handleMoveItem = (item, fromList, toList) => {
    setLists((prevLists) => {
      return prevLists.map((list) => {
        if (list.list_number === fromList) {
          return { ...list, items: list.items.filter((i) => i !== item) };
        }
        if (list.list_number === toList) {
          return { ...list, items: [...list.items, item] };
        }
        return list;
      });
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedLists([]);
    fetchLists();
  };

  const handleUpdate = () => {
    setIsCreating(false);
    setSelectedLists([]);
    alert('Lists updated successfully');
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-view">
        <p>Failed to fetch data</p>
        <button onClick={fetchLists}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>List Creation</h1>
      {isCreating ? (
        <div className="list-creation-view">
          <div className="list-container">
            {selectedLists.map((listNumber) => (
              <div key={listNumber} className="list">
                <h2>List {listNumber}</h2>
                {lists
                  .find((list) => list.list_number === listNumber)
                  ?.items.map((item) => (
                    <div key={item} className="list-item">
                      <span>{item}</span>
                      <button
                        onClick={() =>
                          handleMoveItem(
                            item,
                            listNumber,
                            selectedLists.find((num) => num !== listNumber)
                          )
                        }
                      >
                        {listNumber === selectedLists[0] ? '→' : '←'}
                      </button>
                    </div>
                  ))}
              </div>
            ))}
            <div className="new-list">
              <h2>New List</h2>
              {newList.map((item) => (
                <div key={item} className="list-item">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="actions">
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleUpdate}>Update</button>
          </div>
        </div>
      ) : (
        <div className="all-lists-view">
          <div className="list-container">
            {lists.map((list) => (
              <div key={list.list_number} className="list">
                <input
                  type="checkbox"
                  checked={selectedLists.includes(list.list_number)}
                  onChange={() => toggleListSelection(list.list_number)}
                />
                <h2>List {list.list_number}</h2>
                {list.items.map((item) => (
                  <div key={item} className="list-item">
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button onClick={handleCreateNewList}>Create a new list</button>
        </div>
      )}
    </div>
  );
};

export default App;