const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/history/:id', (req, res) => {
    queryText = `
    SELECT "messages" FROM "chat" WHERE "room_id" = $1;
    `;
    pool.query(queryText, [req.params.id])
    .then((dbRes) => {
      res.status(200).send(dbRes.rows);
    })
    .catch((dbErr) => {
      console.log(`Error getting chat`, dbErr);
      res.sendStatus(500);
    });
  });

  router.post('/setup/:id', (req, res) => {
    queryText = `
    INSERT INTO "chat" (room_id) VALUES ($1);
    `;
    pool.query(queryText, [req.params.id])
    .then((dbRes) => {
      res.sendStatus(201);
    })
    .catch((dbErr) => {
      console.log(`Error creating chat`, dbErr);
      res.sendStatus(500);
    });
  });

  router.put('/send/:id', (req, res) => {
    queryText = `
    UPDATE "chat" SET "messages" = $1 WHERE "room_id" = $2;
    `;
    queryValues = [req.body.messages, req.params.id]
    pool.query(queryText, queryValues)
    .then((dbRes) => {
      res.sendStatus(201);
    })
    .catch((dbErr) => {
      console.log(`Error sending message`, dbErr);
      res.sendStatus(500);
    });
  });

module.exports = router;