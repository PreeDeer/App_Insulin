import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('AlarmclockDB.db');
const tableName = 'alarms';

export const Database = {
  initDatabase() {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, hour INTEGER NOT NULL, minute INTEGER NOT NULL, days TEXT, cardId INTEGER NOT NULL);`,
            [],
            () => {
              resolve();
            },
            (tx, error) => {
              reject(error);
            }
          );
        },
        (error) => {
          reject(error);
        },
        () => {
          // Transaction success
        }
      );
    });
  },

  saveAlarm(hour, minute, selectedDays, cardId) {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `INSERT OR REPLACE INTO ${tableName} (id, hour, minute, days, cardId) VALUES ((SELECT id FROM ${tableName} WHERE cardId = ?), ?, ?, ?, ?);`,
            [cardId, hour, minute, JSON.stringify(selectedDays), cardId],
            (_, resultSet) => {
              resolve(resultSet);
            },
            (tx, error) => {
              reject(error);
            }
          );
        },
        (error) => {
          reject(error);
        },
        () => {
          // Transaction success
        }
      );
    });
  },

  getAlarms() {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM ${tableName};`,
            [],
            (_, resultSet) => {
              const alarms = [];
              for (let i = 0; i < resultSet.rows.length; i++) {
                alarms.push(resultSet.rows.item(i));
              }
              resolve(alarms);
            },
            (tx, error) => {
              reject(error);
            }
          );
        },
        (error) => {
          reject(error);
        },
        () => {
          // Transaction success
        }
      );
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM ${tableName};`,
            [],
            (_, resultSet) => {
              const alarms = [];
              for (let i = 0; i < resultSet.rows.length; i++) {
                alarms.push(resultSet.rows.item(i));
              }
              resolve(alarms);
            },
            (tx, error) => {
              reject(error);
            }
          );
        },
        (error) => {
          reject(error);
        },
        () => {
          // Transaction success
        }
      );
    });
  },
};
