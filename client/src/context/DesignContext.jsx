import React, { createContext, useContext, useState, useCallback } from 'react';

const DesignContext = createContext();

export function DesignProvider({ children }) {
  // Room state (all measurements in meters)
  const [room, setRoom] = useState({
    width: 5,       // meters
    length: 4,      // meters
    height: 2.7,    // meters
    wallColor: "#f5f5f5",
    floorColor: "#c2b280"
  });

  // Placed furniture items
  // Each item: { id, modelId, x, z, rotation, scale }
  // x and z are in meters (not pixels)
  const [items, setItems] = useState([]);

  // Selected item for editing
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Add a new item
  const addItem = useCallback((item) => {
    setItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
  }, []);

  // Update an existing item
  const updateItem = useCallback((id, updates) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  // Delete an item
  const deleteItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  }, [selectedItemId]);

  // Clear all items
  const clearItems = useCallback(() => {
    setItems([]);
    setSelectedItemId(null);
  }, []);

  // Get selected item
  const selectedItem = items.find(item => item.id === selectedItemId) || null;

  return (
    <DesignContext.Provider value={{
      room,
      setRoom,
      items,
      setItems,
      selectedItemId,
      setSelectedItemId,
      selectedItem,
      addItem,
      updateItem,
      deleteItem,
      clearItems
    }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
}