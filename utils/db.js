const { Connection, Request } = require("tedious");

const sqlConfig = {
  server: process.env.SQL_SERVER, // Ensure this is correctly set
  authentication: {
    type: "default",
    options: {
      userName: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
    },
  },
  options: {
    database: process.env.SQL_DATABASE,
    encrypt: true,
    trustServerCertificate: false,
  },
};

// Debugging: Log the SQL configuration
console.log("SQL Config:", sqlConfig);

async function executeSql(query, params = []) {
  return new Promise((resolve, reject) => {
    const connection = new Connection(sqlConfig);
    const results = [];

    connection.on("connect", (err) => {
      if (err) {
        reject(err);
        return;
      }

      const request = new Request(query, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
        connection.close();
      });

      params.forEach((param) => {
        request.addParameter(param.name, param.type, param.value);
      });

      request.on("row", (columns) => {
        const row = {};
        columns.forEach((column) => {
          row[column.metadata.colName] = column.value;
        });
        results.push(row);
      });

      connection.execSql(request);
    });

    connection.connect();
  });
}

module.exports = { executeSql };
