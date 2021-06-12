const knex = require("../db/connection");

async function list() {
  const data = await knex("tables").select("*").orderBy("table_name");
  return data;
}

async function update(id, resId) {
  await knex("tables")
    .where({ table_id: id })
    .update({ reservation_id: resId });

  await knex("reservations")
    .where({ reservation_id: resId })
    .update({ status: "seated" });
}

async function read(id) {
  const data = await knex("tables").select("*").where({ table_id: id }).first();
  return data;
}

async function create(post) {
  const data = await knex("tables").insert(post);
  return data;
}

async function destroy(id, resId) {
  const data = await knex("tables")
    .update({ reservation_id: null })
    .where({ table_id: id });

  await knex("reservations")
    .where({ reservation_id: resId })
    .update({ status: "finished" });

  return data;
}

module.exports = {
  list,
  create,
  update,
  read,
  destroy,
};
