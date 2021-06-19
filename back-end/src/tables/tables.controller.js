const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function validateDataExists(req, res, next) {
  res.locals.data = req.body.data;
  if (!req.body.data) {
    next({ status: 400, message: "Request must contain a data property." });
  } else {
    next();
  }
}

function validateResId(req, res, next) {
  res.locals.reservation_id = Number(req.body.data.reservation_id);
  if (!res.locals.reservation_id) {
    next({ status: 400, message: "Must include reservation_id." });
  } else {
    next();
  }
}

async function validateIdExists(req, res, next) {
  const data = await reservationService.read(res.locals.reservation_id);
  if (!data) {
    next({
      status: 404,
      message: `The reservation_id: ${res.locals.reservation_id} does not exist.`,
    });
  } else {
    res.locals.reservation_people = data.people;
    next();
  }
}

async function validateCapacity(req, res, next) {
  const table = await service.read(Number(req.params.table_id));
  res.locals.occupied = table.reservation_id;
  if (table.capacity >= res.locals.reservation_people) {
    next();
  } else {
    next({
      status: 400,
      message: "The table does not have the capacity for this party.",
    });
  }
}

function validateIsOccupied(req, res, next) {
  if (!res.locals.occupied) {
    next();
  } else {
    next({
      status: 400,
      message: "This table is occupied.",
    });
  }
}

function validateTableNameExists(req, res, next) {
  res.locals.table_name = req.body.data.table_name;
  if (!res.locals.table_name) {
    next({ status: 400, message: "Must include table_name." });
  } else {
    next();
  }
}

function validateTableName(req, res, next) {
  if (res.locals.table_name.length <= 1) {
    next({ status: 400, message: "Must include table_name." });
  } else {
    next();
  }
}

function validateCapacityExists(req, res, next) {
  res.locals.capacity = req.body.data.capacity;
  if (!res.locals.capacity) {
    next({ status: 400, message: "Must include capacity." });
  } else {
    next();
  }
}

function validateCapacityIsNotZero(req, res, next) {
  if (res.locals.capacity === 0) {
    next({ status: 400, message: "Must include capacity larger than zero." });
  } else {
    next();
  }
}

async function validateTableIdExists(req, res, next) {
  res.locals.delete_id = Number(req.params.table_id);
  const data = await service.read(res.locals.delete_id);
  if (!data) {
    next({
      status: 404,
      message: `Table: ${res.locals.delete_id} does not exists.`,
    });
  } else {
    next();
  }
}

async function validateIsNotOccupied(req, res, next) {
  let data = await service.read(res.locals.delete_id);
  data = data.reservation_id;
  if (data) {
    next();
  } else {
    next({
      status: 400,
      message: "This table is not occupied.",
    });
  }
}

async function validateResNotSeated(req, res, next) {
  const id = req.body.data.reservation_id;
  const data = await reservationService.read(id);
  if (data.status === "booked") {
    next();
  } else {
    next({status: 400, message: "Cannot be seated"})
  }
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res, next) {
  const post = req.body.data;
  await service.create(post);
  res.status(201).json({ data: post });
}

async function update(req, res, next) {
  const id = Number(req.params.table_id);
  const resId = req.body.data.reservation_id;
  await service.update(id, resId);
  res.json({ data: resId });
}

async function destroy(req, res, next) {
  const tableData = await service.read(res.locals.delete_id);
  const reservation = await reservationService.read(tableData.reservation_id);
  const data = await service.destroy(res.locals.delete_id, reservation.reservation_id);
  res.json({ data });
}

module.exports = {
  list,
  create: [
    validateDataExists,
    validateTableNameExists,
    validateTableName,
    validateCapacityExists,
    validateCapacityIsNotZero,
    asyncErrorBoundary(create),
  ],
  update: [
    validateDataExists,
    validateResId,
    asyncErrorBoundary(validateIdExists),
    asyncErrorBoundary(validateCapacity),
    validateIsOccupied,
    asyncErrorBoundary(validateResNotSeated),
    asyncErrorBoundary(update),
  ],
  destroy: [asyncErrorBoundary(validateTableIdExists), asyncErrorBoundary(validateIsNotOccupied), asyncErrorBoundary(destroy)],
};
