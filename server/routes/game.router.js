const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/rooms', (req, res) => {
  queryText = `
  SELECT * FROM "games";
  `
  pool.query(queryText)
  .then((dbRes) => {
    res.status(200).send(dbRes.rows);
  })
  .catch((dbErr) => {
    console.log(`Error getting rooms`, dbErr);
    res.sendStatus(500);
  });
});

router.get('/room/:id', (req, res) => {
  queryText = `
  SELECT * FROM "games" WHERE "id" = $1;
  `
  pool.query(queryText, [req.params.id])
  .then((dbRes) => {
    res.status(200).send(dbRes.rows);
  })
  .catch((dbErr) => {
    console.log(`Error getting room`, dbErr);
    res.sendStatus(500);
  });
});

router.post('/firstplayer', (req, res) => {
  queryText = `
  INSERT INTO "games" (room_id, black) VALUES ($1, $2);
  `
  queryValues = [req.body.roomID, req.body.player]
  pool.query(queryText, queryValues)
  .then((dbRes) => {
    res.sendStatus(201);
  })
  .catch((dbErr) => {
    console.log(`Error adding new room`, dbErr);
    res.sendStatus(500);
  });
});

router.put('/secondplayer', (req, res) => {
  queryText = `
  UPDATE "games" SET "white" = $1 WHERE "room_id" = $2;
  `
  queryValues = [req.body.player, req.body.roomID]
  pool.query(queryText, queryValues)
  .then((dbRes) => {
    res.sendStatus(201);
  })
  .catch((dbErr) => {
    console.log(`Error adding new room`, dbErr);
    res.sendStatus(500);
  });
});

router.get('/userRooms/:id', (req, res) => {
  queryText = `
  SELECT * FROM "games" WHERE "black" = $1 OR "white" = $1 ORDER BY "id";
  `
  pool.query(queryText, [req.params.id])
  .then((dbRes) => {
    res.send(dbRes.rows);
  })
  .catch((dbErr) => {
    console.log(`Error getting rooms`, dbErr);
    res.sendStatus(500);
  });
});

router.put('/position/:id', (req, res) => {
  queryText = `
  UPDATE "games" SET "position" = $1, "pgn" = $2 WHERE "id" = $3;
  `
  queryValues = [req.body.position, req.body.pgn, req.params.id]
  pool.query(queryText, queryValues)
  .then((dbRes) => {
    res.sendStatus(201);
  })
  .catch((dbErr) => {
    console.log(`Error adding new room`, dbErr);
    res.sendStatus(500);
  });
});

module.exports = router;
