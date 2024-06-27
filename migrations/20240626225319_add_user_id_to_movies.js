export const up = async function(knex) {
    await knex.schema.table('movies', function(table) {
        table.integer('user_id').unsigned().references('id').inTable('users').nullable();
    });

    await knex('movies').update({ user_id: 2 });

    await knex.schema.table('movies', function(table) {
        table.integer('user_id').unsigned().notNullable().alter();
    });
};

export const down = async function(knex) {
    await knex.schema.table('movies', function(table) {
        table.dropColumn('user_id');
    });
};