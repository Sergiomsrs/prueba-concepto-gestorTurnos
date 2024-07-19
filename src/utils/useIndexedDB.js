import { useEffect } from 'react';

const useIndexedDB = (dbName, storeName) => {
  useEffect(() => {
    const request = window.indexedDB.open(dbName, 1);

    request.onerror = (event) => {
      console.error("Database error: ", event.target.errorCode);
    };

    request.onsuccess = (event) => {
      console.log("Database opened successfully.");
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(storeName, { keyPath: "id" });
      console.log("ObjectStore created successfully.");
    };
  }, [dbName, storeName]);

  const saveData = (data) => {
    const request = window.indexedDB.open(dbName, 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], "readwrite");
      const objectStore = transaction.objectStore(storeName);
      
      const addRequest = objectStore.add(data);
      
      addRequest.onsuccess = () => {
        console.log("Data added to the store successfully.");
      };
      
      addRequest.onerror = (event) => {
        console.error("Error adding data: ", event.target.errorCode);
      };
    };
  };

  return saveData;
};

export default useIndexedDB;
