/* eslint-disable camelcase */
const albumMapDBToModel = ({
  id, name, year, created_at, updated_at, cover_image = null,
}) => {
  let coverUrl = null;

  if (cover_image !== null) {
    coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${cover_image}`;
  }

  return {
    id,
    name,
    year,
    createdAt: created_at,
    updatedAt: updated_at,
    coverUrl,
  };
};

const songMapDBToModel = ({
  created_at, updated_at, ...args
}) => ({
  ...args,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { albumMapDBToModel, songMapDBToModel };
