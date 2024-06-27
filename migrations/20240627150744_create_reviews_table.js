/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function(knex) {
    await knex.schema.createTable('reviews', function(table) {
        table.increments('id').primary();
        table.integer('movie_id').unsigned().notNullable();
        table.foreign('movie_id').references('movies.id').onDelete('CASCADE');
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.integer('rating').notNullable();
        table.text('review_text').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function(knex) {
    await knex.schema.dropTable('reviews');
};