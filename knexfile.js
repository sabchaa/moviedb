export default {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./mydb.sqlite",
    },
    useNullAsDefault: false,
    debug: false,
  },
}