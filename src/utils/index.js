/* eslint-disable camelcase */
const albumMapDBToModel = ({
  id, name, year, created_at, updated_at,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

const songMapDBToModel = ({
  created_at, updated_at, ...args
}) => ({
  ...args,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { albumMapDBToModel, songMapDBToModel };
