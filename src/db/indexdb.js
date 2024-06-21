
export default async function getIndexedDB() {
  // Creating the database variable
  const dbName = "trainerDB"

  // Create the TrainerDB database
  // Open TrainerDB if it already exists
  const request = window.indexedDB.open(dbName, 1);

  // Setting up the Object Store for trainers
  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // This creates the ObjectStore
    db.createObjectStore("trainers", { keyPath: "name" })
      // Create an index to search trainer by name
      .createIndex("nameIdx", "name", {unique: true})
      // Maybe make skiremon a separate ObjectStore?***
      // Create an index to search skiremon by id
      // .createIndex("skirmishCards", "skirmishCards", {unique: false});

    // Create an index to search skiremon by name
  }

  // Log any errors
  request.onerror = (event) => {
    // Error handling
    console.error(`Database error: ${event.target.error}`);
  }
}

// Function checks IndexedDB for data
export async function searchDB(key, IdxDB = "trainerDB", objStoreName = "trainers", idxName = "nameIdx") {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IdxDB);

    req.onsuccess = (e) => {
      const db = e.target.result;
      const trn = db.transaction(objStoreName, "readonly");
      const store = trn.objectStore(objStoreName);
      const idx = store.index(idxName);
      const data = idx.get(key);

      data.onsuccess = () => {
        if (data.result) {
          console.log("Data found:", data.result);
          // Resolve the request with the data
          resolve(data.result); 
        } else {
          console.log("No data found");
          // Resolve with null if no data found
          resolve(null); 
        }
      };

      data.onerror = (event) => {
        console.error("Error fetching data: ", event.target.error);
        // Reject the request if no data found
        reject(event.target.error);
      }
    }

    // If error is returned when fetching database
    req.onerror = (e) => {
      console.error("Unable to access database: ", e.target.error);
      // Reject the request if no database found
      reject(e.target.error);
    }
  });
}

export async function updateSkirmishCardsObj(name, skireData, IdxDB = "trainerDB", objStoreName = "trainers", idxName = "nameIdx") {
  // Open the database
  const req = indexedDB.open(IdxDB);

  // Start transaction if database is accessible
  req.onsuccess = (e) => {
    const db = e.target.result;
    const transact = db.transaction([objStoreName], "readwrite");
    const store = transact.objectStore(objStoreName);
    const idx = store.index(idxName);
    const query = idx.get(name);

    // If transaction is successful
    query.onsuccess = () => {
      // Create the trainer variable
      const trainer = query.result;
      // Add skiremon cards to trainer
      if (trainer) { 
        skireData.forEach(card => {
          const key = Object.keys(card);
      
          if (key[0] in trainer.skirmishCards) {
            console.log(`${key[0]} already exists, cannot add.`);
          } else {
            trainer.skirmishCards[key] = card;
          }
        });

        store.put(trainer);
      } else {
        console.log("Trainer already exists.");
      }
    };

    query.onerror = () => {
      console.error("Error: can't fetch trainer.");
    };

    // Ensures the data has been added to the database
    transact.oncomplete = () => {
      console.log("Transaction completed.");
    };

    transact.onerror = (event) => {
      console.error("Transaction failed: ", event.target.error);
    };
  };

  // If fetch fails, log the error
  req.onerror = (e) => {
    console.error("Unable to open database: ", e.target.error);
  };
}

export async function newTrainerObj(key, IdxDB = "trainerDB", objStoreName = "trainers", idxName = "nameIdx") {
  // Open the database
  const req = indexedDB.open(IdxDB);

  // Show that we want to add/edit data
  req.onupgradeneeded = (event) => {
    const db = event.target.result;
    // Create the ObjectStore if there is not one
    if (!db.objectStoreNames.contains(objStoreName)) {
      db.createObjectStore(objStoreName, { keyPath: "name" }).createIndex("nameIdx", "name", {unique: true});
    }
  };

  // Start transaction if database is accessible
  req.onsuccess = (e) => {
    const db = e.target.result;
    const transact = db.transaction(objStoreName, "readwrite");
    const store = transact.objectStore(objStoreName);
    const idx = store.index(idxName);
    const query = idx.get(key);

    // If transaction is successful
    query.onsuccess = () => {
      // Add trainer if they don't exist
      if (!query.result) { 
        store.add({
          name: key,
          pass: "secret",
          wins: 0,
          losses: 0,
          draws: 0,
          coins: 0,
          coinsEarned: 0,
          roundsWon: 0,
          roundsLost: 0,
          roundDraws: 0,
          skirmishCards: {}
        });
      } else {
        console.log("Trainer already exists.");
      }
    };

    query.onerror = () => {
      console.error("Error: query failed.");
    };

    // Ensures the data has been added to the database
    transact.oncomplete = () => {
      console.log("Transaction completed.");
    };

    transact.onerror = (event) => {
      console.error("Transaction failed: ", event.target.error);
    };
  };

  // If fetch fails, log the error
  req.onerror = (e) => {
    console.error("Unable to access database: ", e.target.error);
  };
}

// Updates data for the trainer
export async function updateTrainerObj(name, newData, key = false, redirect = false, IdxDB = "trainerDB", objStoreName = "trainers") {
  // Open the database
  const req = indexedDB.open(IdxDB, 1);

  // Start transaction if database is accessible
  req.onsuccess = (e) => {
    const db = e.target.result;
    const transact = db.transaction([objStoreName], "readwrite");
    const store = transact.objectStore(objStoreName);
    const query = store.get(name);

    // If transaction is successful
    query.onsuccess = () => {
      // Create the trainer variable
      let trainer = query.result;
      // If a trainer is located
      if (trainer) { 
        // If no key, update all the trainer data
        if (!key) {
          trainer = newData;
        // If key, update section of trainer data
        } else {
          // Update trainer with newData
          trainer[key] = newData;
        }
        
        // Save the newData to the database
        const result = store.put(trainer);
        // Log the results of the transaction
        result.onsuccess = () => {
          console.log("Trainer data saved.");
        }
        result.onerror = () => {
          console.error("Error saving trainer data.");
        }
      } else {
        console.log("Trainer not found.");
      }
    }

    query.onerror = () => {
      console.error("Error: can't fetch trainer.");
    };

    // Ensures the data has been added to the database
    transact.oncomplete = () => {
      console.log("Transaction completed.");
      // Load next page if redirect is true
      if (redirect) { 
        try {
          location.assign("../endgame/index.html");
        } catch (error) {
          console.error("Error loading page: ", error);
        } 
      }
    };

    transact.onerror = (event) => {
      console.error("Transaction failed: ", event.target.error);
    };

    transact.onabort = () => {
      console.error("Transaction aborted:", transact.error);
    };
  };

  // If fetch fails, log the error
  req.onerror = (e) => {
    console.error("Unable to open database: ", e.target.error);
  };
}

// Remove an entry from IndexedDB
export async function deleteTrainerObj(trainerId, IdxDB = "trainerDB", objStoreName = "trainers") {
  const request = indexedDB.open(IdxDB);

  request.onsuccess = (event) => {
      const db = event.target.result;
      const t = db.transaction([objStoreName], "readwrite");
      const store = t.objectStore(objStoreName);
      const deleteRequest = store.delete(trainerId);

      deleteRequest.onsuccess = () => {
          console.log(`Trainer ${trainerId} deleted successfully.`);
      };

      deleteRequest.onerror = (e) => {
          console.error("Error deleting trainer:", e.target.error);
      };

      t.oncomplete = () => {
          console.log("Transaction completed.");
      };

      t.onerror = (e) => {
          console.error("Transaction error:", e.target.error);
      };
  };

  request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
  };
}
