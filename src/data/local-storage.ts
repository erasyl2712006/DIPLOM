// Helper functions for working with localStorage

    /**
     * Saves data to localStorage with the specified key
     */
    export function saveToLocalStorage<T>(key: string, data: T): void {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
      }
    }

    /**
     * Gets data from localStorage by key
     */
    export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error(`Error getting from localStorage (${key}):`, error);
        return defaultValue;
      }
    }

    /**
     * Updates specific items in a collection stored in localStorage
     */
    export function updateCollectionItem<T extends { id: string }>(
      storageKey: string, 
      itemId: string, 
      updatedData: Partial<T>,
      defaultCollection: T[]
    ): T[] {
      const collection = getFromLocalStorage<T[]>(storageKey, defaultCollection);
      const updatedCollection = collection.map(item => 
        item.id === itemId ? { ...item, ...updatedData } : item
      );
      saveToLocalStorage(storageKey, updatedCollection);
      return updatedCollection;
    }

    /**
     * Adds an item to a collection in localStorage
     */
    export function addCollectionItem<T>(
      storageKey: string, 
      newItem: T,
      defaultCollection: T[]
    ): T[] {
      const collection = getFromLocalStorage<T[]>(storageKey, defaultCollection);
      const updatedCollection = [newItem, ...collection];
      saveToLocalStorage(storageKey, updatedCollection);
      return updatedCollection;
    }

    /**
     * Removes an item from a collection in localStorage
     */
    export function removeCollectionItem<T extends { id: string }>(
      storageKey: string, 
      itemId: string,
      defaultCollection: T[]
    ): T[] {
      const collection = getFromLocalStorage<T[]>(storageKey, defaultCollection);
      const updatedCollection = collection.filter(item => item.id !== itemId);
      saveToLocalStorage(storageKey, updatedCollection);
      return updatedCollection;
    }

    /**
     * Initializes localStorage with default data if empty
     */
    export function initializeLocalStorage<T>(key: string, defaultData: T): void {
      if (!localStorage.getItem(key)) {
        saveToLocalStorage(key, defaultData);
      }
    }
