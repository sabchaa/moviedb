/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('movies', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('img').notNullable();
        table.string('director').notNullable();
        table.string('description').notNullable();
        table.integer('year').notNullable();
        table.integer('runtime').notNullable();
        table.string('genre').notNullable();
        table.decimal('rating', 3, 1).notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.dropTable('movies')
};
