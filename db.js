var { Pool } = require('pg');
var async = require('async');

var settings = require('./settings');
var pool = new Pool({
  user: settings.user,
  host: settings.host,
  database: settings.db,
  password: settings.password,
  port: settings.port
});

console.log("Database Configuration:");
console.log("User:", settings.user);
console.log("Host:", settings.host);
console.log("Database:", settings.db);
console.log("Password:", settings.password);
console.log("Port:", settings.port);

var functions = {
  createTables: function(next) {
    console.log("Creating tables...");
    async.series({
      createUsers: function(callback) {
        console.log("Creating users table...");
        pool.query("CREATE TABLE IF NOT EXISTS users (" +
            "id SERIAL PRIMARY KEY," +
            "email VARCHAR(75) NOT NULL," +
            "password VARCHAR(128) NOT NULL);", [],
            function(err, res) {
              if (err) {
                console.error("Error creating users table:", err);
              } else {
                console.log("Users table created successfully.");
              }
              callback(err, res);
            });
      },
      createPads: function(callback) {
        console.log("Creating pads table...");
        pool.query("CREATE TABLE IF NOT EXISTS pads (" +
            "id SERIAL PRIMARY KEY," +
            "name VARCHAR(100) NOT NULL," +
            "user_id INTEGER NOT NULL REFERENCES users(id));", [],
            function(err, res) {
              if (err) {
                console.error("Error creating pads table:", err);
              } else {
                console.log("Pads table created successfully.");
              }
              callback(err, res);
            });
      },
      createNotes: function(callback) {
        console.log("Creating notes table...");
        pool.query("CREATE TABLE IF NOT EXISTS notes (" +
            "id SERIAL PRIMARY KEY," +
            "pad_id INTEGER REFERENCES pads(id)," +
            "user_id INTEGER NOT NULL REFERENCES users(id)," +
            "name VARCHAR(100) NOT NULL," +
            "text TEXT NOT NULL," +
            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
            "updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);", [],
            function(err, res) {
              if (err) {
                console.error("Error creating notes table:", err);
              } else {
                console.log("Notes table created successfully.");
              }
              callback(err, res);
            });
      }
    },
    function(err, results) {
      if (err) {
        console.error("Error creating tables:", err);
      } else {
        console.log("All tables created successfully.");
      }
      next(err, results);
    });
  },

  applyFixtures: function(next) {
    console.log("Applying fixtures...");
    this.truncateTables(function() {
      async.series([
        function(callback) {
          pool.query("INSERT INTO users (id, email, password) VALUES (1, 'user1@example.com', " +
                     "'$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u')", [],
                    function(err, res) {
                      if (err) {
                        console.error("Error inserting user1:", err);
                      } else {
                        console.log("User1 inserted successfully.");
                      }
                      callback(err, res);
                    });
        },
        function(callback) {
          pool.query("INSERT INTO users (id, email, password) VALUES (2, 'user2@example.com', " +
                     "'$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u')", [],
                    function(err, res) {
                      if (err) {
                        console.error("Error inserting user2:", err);
                      } else {
                        console.log("User2 inserted successfully.");
                      }
                      callback(err, res);
                    });

        },
        function(callback) {
          pool.query("INSERT INTO pads (id, name, user_id) VALUES (1, 'Pad 1', 1)", [],
                    function(err, res) {
                      if (err) {
                        console.error("Error inserting pad1:", err);
                      } else {
                        console.log("Pad1 inserted successfully.");
                      }
                      callback(err, res);
                    });
        },
        function(callback) {
          pool.query("INSERT INTO pads (id, name, user_id) VALUES (2, 'Pad 2', 1)", [],
                    function(err, res) {
                      if (err) {
                        console.error("Error inserting pad2:", err);
                      } else {
                        console.log("Pad2 inserted successfully.");
                      }
                      callback(err, res);
                    });
        },
        function(callback) {
          pool.query("INSERT INTO notes (id, pad_id, user_id, name, text, created_at, updated_at) VALUES (1, 1, 1, 'Note 1', 'Text', '2025-03-10 11:00:00', '2025-03-10 11:00:00')", [],
                    function(err, res) {
                      if (err) {
                        console.error("Error inserting note1:", err);
                      } else {
                        console.log("Note1 inserted successfully.");
                      }
                      callback(err, res);
                    });
        },
        function(callback) {
          pool.query("INSERT INTO notes (id, pad_id, user_id, name, text, created_at, updated_at) VALUES (2, 1, 1, 'Note 2', 'Text', '2025-03-10 11:00:00', '2025-03-10 11:00:00')", [],
                    function(err, res) {
                      if (err) {
                        console.error("Error inserting note2:", err);
                      } else {
                        console.log("Note2 inserted successfully.");
                      }
                      callback(err, res);
                    });
        }
      ], function(err, results) {
        if (err) {
          console.error("Error applying fixtures:", err);
        } else {
          console.log("Fixtures applied successfully.");
        }
        next(err, results);
      })
    });
  },

  truncateTables: function(next) {
    console.log("Truncating tables...");
    async.series([
      function(callback) {
        pool.query("DELETE FROM users;", [],
                  function(err, res) {
                    if (err) {
                      console.error("Error truncating users:", err);
                    } else {
                      console.log("Users truncated successfully.");
                    }
                    callback(err, res);
                  });
      },
      function(callback) {
        pool.query("DELETE FROM notes;", [],
                  function(err, res) {
                    if (err) {
                      console.error("Error truncating notes:", err);
                    } else {
                      console.log("Notes truncated successfully.");
                    }
                    callback(err, res);
                  });

      },
      function(callback) {
        pool.query("DELETE FROM pads;", [],
                  function(err, res) {
                    if (err) {
                      console.error("Error truncating pads:", err);
                    } else {
                      console.log("Pads truncated successfully.");
                    }
                    callback(err, res);
                  });
      }
    ], function(err, results) {
      if (err) {
        console.error("Error truncating tables:", err);
      } else {
        console.log("Tables truncated successfully.");
      }
      next(err, results);
    })
  }
}

if (require.main === module) {
  console.log("Starting database initialization...");
  functions.createTables(function(err, results) {
    if (err) {
      console.error("Error during database initialization:", err);
    } else {
      console.log("DB successfully initialized");
    }
  });
}

module.exports = functions;