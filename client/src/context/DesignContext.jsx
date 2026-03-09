import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const DesignContext = createContext();

// Load from sessionStorage to survive navigation
function loadState(key, defaultValue) {
  try {
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function DesignProvider({ children }) {
  // Room state (all measurements in meters)
  const [room, setRoom] = useState(() => loadState('design_room', {
    width: 5,
    length: 4,
    height: 2.7,
    wallColor: "#f5f5f5",
    floorColor: "#c2b280"
  }));

  // Placed furniture items
  const [items, setItems] = useState(() => loadState('design_items', []));

  // Selected item
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Persist to sessionStorage on changes
  useEffect(() => {
    sessionStorage.setItem('design_room', JSON.stringify(room));
  }, [room]);

  useEffect(() => {
    sessionStorage.setItem('design_items', JSON.stringify(items));
  }, [items]);

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
    setSelectedItemId(prev => prev === id ? null : prev);
  }, []);

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