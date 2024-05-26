const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/rooms', (req, res) => {
  queryText = `
  SELECT * FROM "games";
  `
  pool.query(queryText)
  .then((dbRes) => {
    res.send(dbRes.rows);
  })
  .catch((dbErr) => {
    console.log(`Error getting rooms`, dbErr);
    res.sendStatus(500);
  });
});

router.post('/firstplayer', (req, res) => {
  queryText = `
  INSERT INTO "games" (room_id, white) VALUES ($1, $2);
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
  UPDATE "games" SET "black" = $1 WHERE "room_id" = $2;
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

module.exports = router;
