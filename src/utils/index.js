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
  id, title, year, performer, genre, duration, album_id, created_at, updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

const allSongMapDBToModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

module.exports = { albumMapDBToModel, songMapDBToModel, allSongMapDBToModel };