/* eslint-disable camelcase */
const albumMapDBToModel = ({
  id, name, year, created_at, updated_at, cover_image = null,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
  coverUrl: cover_image,
});

const songMapDBToModel = ({
  created_at, updated_at, ...args
}) => ({
  ...args,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { albumMapDBToModel, songMapDBToModel };
