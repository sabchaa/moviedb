
export const up = async (knex) => {
    await knex.schema.createTable('watchlist', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.integer('movie_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.foreign('movie_id').references('movies.id').onDelete('CASCADE');
    });
};
  
  export const down = async (knex) => {
    await knex.schema.dropTable('watchlist');
};
