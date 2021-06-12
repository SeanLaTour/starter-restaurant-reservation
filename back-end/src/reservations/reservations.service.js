const knex = require("../db/connection");

async function listByDate(date) {
  const data = await knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
  return data;
}

async function listByMobile(mobile_number) {
  const data = await knex("reservations")
    .select("*")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
  return data;
}

async function create(post) {
  const data = await knex("reservations").insert(post);
  return data;
}

async function read(id) {
  const data = await knex("reservations")
    .select("*")
    .where({ reservation_id: id })
    .first();
  return data;
}

async function update(id, put) {
  const data = await knex("reservations")
    .select("*")
    .where({ reservation_id: id })
    .update(put)
    .returning("*");
  return data[0];
}

module.exports = {
  listByDate,
  listByMobile,
  create,
  read,
  update,
};
