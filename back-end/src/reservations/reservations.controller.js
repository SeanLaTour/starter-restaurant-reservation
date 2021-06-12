const service = require("./reservations.service");

// AsyncErrorBoundar is being funky.

function validateDataExists(req, res, next) {
  res.locals.data = req.body.data;
  if (!req.body.data) {
    next({ status: 400, message: "Request must contain a data property." });
  } else {
    next();
  }
}

function validateFirstNameExists(req, res, next) {
  res.locals.first_name = req.body.data.first_name;
  if (!res.locals.first_name) {
    next({ status: 400, message: "Must include first_name." });
  } else {
    next();
  }
}

function validateFirstName(req, res, next) {
  if (res.locals.first_name.length < 1) {
    next({ status: 400, message: "Must include first_name." });
  } else {
    next();
  }
}

function validateLastNameExists(req, res, next) {
  res.locals.last_name = req.body.data.last_name;
  if (!res.locals.last_name) {
    next({ status: 400, message: "Must include last_name." });
  } else {
    next();
  }
}

function validateLastName(req, res, next) {
  if (res.locals.last_name.length < 1) {
    next({ status: 400, message: "Must include last_name." });
  } else {
    next();
  }
}

function validateMobileExits(req, res, next) {
  res.locals.mobile_number = req.body.data.mobile_number;
  if (!res.locals.mobile_number) {
    next({ status: 400, message: "Must include mobile_number." });
  } else {
    next();
  }
}

function validateMobile(req, res, next) {
  if (res.locals.mobile_number.length < 1) {
    next({ status: 400, message: "Must include mobile_number." });
  } else {
    next();
  }
}

function validateDate(req, res, next) {
  res.locals.date = req.body.data.reservation_date;
  if (!res.locals.date) {
    next({ status: 400, message: "Must include reservation_date." });
  } else {
    next();
  }
}

function validateDateFormat(req, res, next) {
  if (res.locals.date[4] != "-") {
    next({
      status: 400,
      message: "The reservation_date must be in date format.",
    });
  } else {
    next();
  }
}

function validateTime(req, res, next) {
  res.locals.time = req.body.data.reservation_time;
  if (!res.locals.time) {
    next({ status: 400, message: "Must include reservation_time." });
  } else {
    next();
  }
}

function validateTimeFormat(req, res, next) {
  if (res.locals.time[2] != ":") {
    next({
      status: 400,
      message: "The reservation_time must be in time format",
    });
  } else {
    next();
  }
}

function validateIsWithinOpenHours(req, res, next) {
  let time = res.locals.time;
  time = time.split(":");
  time = time.join("");
  time = Number(time);
  if (1030 <= time && time <= 2130) {
    next();
  } else {
    next({ status: 400, message: "Must be within operating hours." });
  }
}

function validateIsTuesday(req, res, next) {
  const date = new Date(res.locals.date);
  if (date.getDay() == 1) {
    next({ status: 400, message: "Restaurant is closed on Tuesdays." });
  } else {
    next();
  }
}

function validateNotInPast(req, res, next) {
  let now = new Date();
  now.setHours(+8);
  let time = res.locals.time;
  time = time.split(":");
  let date = new Date(res.locals.date);
  date.setDate(date.getDate() + 1);
  date.setHours(time[0] - 7);
  date.setMinutes(time[1]);
  if (date < now) {
    next({ status: 400, message: "Reservation must be a future time." });
  } else {
    next();
  }
}

function validatePeopleExist(req, res, next) {
  res.locals.people = req.body.data.people;
  if (!res.locals.people) {
    next({ status: 400, message: "Must include number of people." });
  } else {
    next();
  }
}

function validatePeopleIsNumber(req, res, next) {
  if (!Number.isInteger(res.locals.people)) {
    next({ status: 400, message: "The people field must be a number." });
  } else {
    next();
  }
}

async function validateResIdExists(req, res, next) {
  res.locals.res_id = Number(req.params.reservation_id);
  const data = await service.read(res.locals.res_id);
  if (!data) {
    next({
      status: 404,
      message: `Reservation: ${res.locals.res_id} does not exist.`,
    });
  } else {
    next();
  }
}

function validateStatusIsBooked(req, res, next) {
  const status = req.body.data.status;
  if (status === "booked" || !status) {
    next();
  } else {
    next({ status: 400, message: `Status cannot be ${status}.` });
  }
}

function validateStatusIsKnown(req, res, next) {
  res.locals.status = req.body.data.status;
  if (
    res.locals.status === "booked" ||
    res.locals.status === "seated" ||
    res.locals.status === "finished" ||
    res.locals.status === "cancelled" ||
    res.locals.status === null ||
    res.locals.status === undefined
  ) {
    next();
  } else {
    next({ status: 400, message: `Status cannot be ${res.locals.status}.` });
  }
}

async function validateNotAlreadyFinished(req, res, next) {
  const reservation = await service.read(Number(req.params.reservation_id));
  const status = reservation.status;
  if (status === "finished") {
    next({ status: 400, message: "Cannot update a finished reservation." });
  } else {
    next();
  }
}

async function list(req, res) {
  if (req.query.date) {
    const date = req.query.date;
    const data = await service.listByDate(date);
    res.json({ data });
  } else if (req.query.mobile_number) {
    const mobile = req.query.mobile_number;
    const data = await service.listByMobile(mobile);
    res.json({ data });
  }
}

async function create(req, res, next) {
  const post = res.locals.data;
  await service.create(post);
  res.status(201).json({ data: post });
}

async function read(req, res, next) {
  const id = req.params.reservation_id;
  const data = await service.read(id);
  res.json({ data });
}

async function update(req, res, next) {
  const id = req.params.reservation_id;
  const put = req.body.data;
  const data = await service.update(id, put);
  res.status(200).json({ data });
}

async function updateStatus(req, res, next) {
  const id = req.params.reservation_id;
  const put = req.body.data;
  const data = await service.update(id, put);
  res.status(200).json({ data });
}

module.exports = {
  list,
  create: [
    validateDataExists,
    validateFirstNameExists,
    validateFirstName,
    validateLastNameExists,
    validateLastName,
    validateMobileExits,
    validateMobile,
    validateDate,
    validateDateFormat,
    validateTime,
    validateTimeFormat,
    validatePeopleExist,
    validatePeopleIsNumber,
    validateIsWithinOpenHours,
    validateIsTuesday,
    validateNotInPast,
    validateStatusIsBooked,
    create,
  ],
  read: [validateResIdExists, read],
  updateStatus: [
    validateResIdExists,
    validateNotAlreadyFinished,
    validateStatusIsKnown,
    updateStatus,
  ],
  update: [
    validateResIdExists,
    validateDataExists,
    validateFirstNameExists,
    validateFirstName,
    validateLastNameExists,
    validateLastName,
    validateMobileExits,
    validateMobile,
    validateDate,
    validateDateFormat,
    validateTime,
    validateTimeFormat,
    validatePeopleExist,
    validatePeopleIsNumber,
    validateIsTuesday,
    validateNotInPast,
    validateStatusIsBooked,
    update
  ]
};
