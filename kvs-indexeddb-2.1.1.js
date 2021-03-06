"use strict";
window.kvs = {};
window.kvs.kvsIndexedDB = void 0;
function invariant(condition, message) {
  if (condition) {
    return;
  }
  throw new Error(message);
}
const openDB = ({ name, version, tableName, onUpgrade }) => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(name, version);
    openRequest.onupgradeneeded = function (event) {
      var _a;
      const oldVersion = event.oldVersion;
      const newVersion = (_a = event.newVersion) !== null && _a !== void 0 ? _a : version;
      const database = openRequest.result;
      try {
        // create table at first time
        if (!newVersion || newVersion <= 1) {
          database.createObjectStore(tableName);
        }
      }
      catch (e) {
        reject(e);
      }
      // for drop instance
      // https://github.com/w3c/IndexedDB/issues/78
      // https://www.w3.org/TR/IndexedDB/#introduction
      database.onversionchange = () => {
        database.close();
      };
      // @ts-ignore
      event.target.transaction.oncomplete = () => {
        Promise.resolve(onUpgrade({
          oldVersion,
          newVersion,
          database
        })).then(() => {
          return resolve(database);
        });
      };
    };
    openRequest.onblocked = () => {
      reject(openRequest.error);
    };
    openRequest.onerror = function () {
      reject(openRequest.error);
    };
    openRequest.onsuccess = function () {
      const db = openRequest.result;
      resolve(db);
    };
  });
};
const dropInstance = (database, databaseName) => {
  return new Promise((resolve, reject) => {
    database.close();
    const request = indexedDB.deleteDatabase(databaseName);
    request.onupgradeneeded = (event) => {
      event.preventDefault();
      resolve();
    };
    request.onblocked = () => {
      reject(request.error);
    };
    request.onerror = function () {
      reject(request.error);
    };
    request.onsuccess = function () {
      resolve();
    };
  });
};
const getItem = (database, tableName, key) => {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(tableName, "readonly");
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.get(String(key));
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};
const hasItem = async (database, tableName, key) => {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(tableName, "readonly");
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.count(String(key));
    request.onsuccess = () => {
      resolve(request.result !== 0);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};
const setItem = async (database, tableName, key, value) => {
  // If the value is undefined, delete the key
  // This behavior aim to align localStorage implementation
  if (value === undefined) {
    await deleteItem(database, tableName, key);
    return;
  }
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(tableName, "readwrite");
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.put(value, String(key));
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onabort = () => {
      reject(request.error ? request.error : transaction.error);
    };
    transaction.onerror = () => {
      reject(request.error ? request.error : transaction.error);
    };
  });
};
const deleteItem = async (database, tableName, key) => {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(tableName, "readwrite");
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.delete(String(key));
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onabort = () => {
      reject(request.error ? request.error : transaction.error);
    };
    transaction.onerror = () => {
      reject(request.error ? request.error : transaction.error);
    };
  });
};
const clearItems = async (database, tableName) => {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(tableName, "readwrite");
    const objectStore = transaction.objectStore(tableName);
    const request = objectStore.clear();
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onabort = () => {
      reject(request.error ? request.error : transaction.error);
    };
    transaction.onerror = () => {
      reject(request.error ? request.error : transaction.error);
    };
  });
};
const iterator = (database, tableName) => {
  const handleCursor = (request) => {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) {
          return resolve({
            done: true
          });
        }
        return resolve({
          done: false,
          value: cursor
        });
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  };
  const transaction = database.transaction(tableName, "readonly");
  const objectStore = transaction.objectStore(tableName);
  const request = objectStore.openCursor();
  return {
    async next() {
      const { done, value } = await handleCursor(request);
      if (!done) {
        const storageKey = value === null || value === void 0 ? void 0 : value.key;
        const storageValue = value === null || value === void 0 ? void 0 : value.value;
        value === null || value === void 0 ? void 0 : value.continue();
        return { done: false, value: [storageKey, storageValue] };
      }
      return { done: true, value: undefined };
    }
  };
};
const createStore = ({ database, databaseName, tableName }) => {
  const store = {
    delete(key) {
      return deleteItem(database, tableName, key).then(() => true);
    },
    get(key) {
      return getItem(database, tableName, key);
    },
    has(key) {
      return hasItem(database, tableName, key);
    },
    set(key, value) {
      return setItem(database, tableName, key, value).then(() => store);
    },
    clear() {
      return clearItems(database, tableName);
    },
    dropInstance() {
      return dropInstance(database, databaseName);
    },
    close() {
      return Promise.resolve().then(() => {
        database.close();
      });
    },
    [Symbol.asyncIterator]() {
      return iterator(database, tableName);
    },
    __debug__database__: database
  };
  return store;
};
const kvsIndexedDB = async (options) => {
  var _a;
  const { name, version, upgrade, ...indexDBOptions } = options;
  invariant(typeof name === "string", "name should be string");
  invariant(typeof version === "number", "version should be number");
  const tableName = (_a = indexDBOptions.tableName) !== null && _a !== void 0 ? _a : "kvs";
  const database = await openDB({
    name,
    version,
    tableName,
    onUpgrade: ({ oldVersion, newVersion, database }) => {
      if (!upgrade) {
        return;
      }
      return upgrade({
        kvs: createStore({ database: database, tableName: tableName, databaseName: name }),
        oldVersion,
        newVersion
      });
    }
  });
  return createStore({ database: database, tableName: tableName, databaseName: name });
};
window.kvs.kvsIndexedDB = kvsIndexedDB;
//# sourceMappingURL=index.js.map
