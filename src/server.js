const express = require('express');
const sql = require('./sql');
const helmet = require('helmet');
const cors = require('cors');
const nanoid = require('nanoid');
const path = require('path');
const bodyparser = require('body-parser');

module.exports = (app) => {
  const port = 3000;
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cors());
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '/public'));

  app.use(express.static('./src/public'));

  app.get('/info/:slug', async (req, res) => {
    try {
      const conn = app.get('dbcon');
      const redirect = await conn.query(sql.GET, [req.params.slug]);
      console.log(req.params.slug);
      if (redirect.length == 1) {
        res.render('created', {
          redirect: (await conn.query(sql.GET, [req.params.slug]))[0],
          base: 'http://localhost:3000',
        });
      } else {
        throw new Error();
      }
    } catch (e) {
      console.log(e);
      res.status(400).render('error', {
        error: 'Redirect does not exist.',
      });
    }
  });

  app.get('/:slug', async (req, res) => {
    try {
      const conn = app.get('dbcon');
      const redirect = await conn.query(sql.GET, [req.params.slug]);
      if (redirect.length == 1) {
        res.redirect(redirect[0].url);
      } else {
        throw new Error();
      }
    } catch (e) {
      res.status(400).render('error', {
        error: 'Redirect does not exist.',
      });
    }
  });

  app.post('/url', async (req, res) => {
    const conn = app.get('dbcon');
    try {
      if (!req.body.url) throw new Error();
      if (!req.body.slug) req.body.slug = nanoid.nanoid(10);

      const result = await conn.query(sql.INSERT, [
        req.body.slug,
        req.body.url,
      ]);
      if (result.affectedRows == 1) {
        res.render('created', {
          redirect: (await conn.query(sql.GET, [req.body.slug]))[0],
          base: 'http://localhost:3000',
        });
      } else {
        throw new Error('');
      }
    } catch (e) {
      res.status(400).render('error', {
        error: 'Something went wrong ... try again.',
      });
    }
  });

  app.listen(port, () => console.log(`http://localhost:${port}`));
};
