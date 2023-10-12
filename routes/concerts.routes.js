//concerts
const express = require('express');
const router = express.Router();
const db = require('./../db');

// get all concerts
router.route('/concerts').get((req, res) => {
  res.json(db.concerts);
});

//get one random concert
router.route('/concerts/random').get((req, res) => {
  const random = Math.floor(Math.random() * db.concerts.length)
  res.json(db.concerts[random])
})

// get one concert
router.route('/concerts/:id').get((req, res) => {
  const id = Number(req.params.id)
	const concert = db.concerts.find(element => element.id === id)
	if (!concert) {
		return res.status(404).json({ message: 'Invalid ID' })
	}
	res.json(concert)
});

// post one concert to db
router.route('/concerts').post((req, res) => {
	const id = db.concerts[db.concerts.length - 1].id + 1;
	const newconcert = Object.assign({ id: id }, req.body);
	db.concerts.push(newconcert);
	res.status(201).json({ message: 'OK' });
});

// change one concert on db
router.route('/concerts/:id').put((req, res) => {
	const { author, text } = req.body
	const id = Number(req.params.id)
	const concert = db.concerts.find(element => element.id === id)
	const index = db.concerts.indexOf(concert)
	if (!concert) {
		return res.status(404).json({ message: 'Invalid ID' })
	} else {
		db.concerts[index] = { ...concert, author, text }
		res.json({ message: 'data changed' })
	}
})

// Remove one concert from db
router.route('/concerts/:id').delete((req, res) => {
	const id = Number(req.params.id)
	const concert = db.concerts.find(element => element.id === id)
	const index = db.concerts.indexOf(concert)

	if (!concert) {
		return res.status(404).json({ message: 'Invalid ID' })
	} else {
		db.concerts.splice(index, 1)
		res.json({ message: 'OK, deleted' })
	}
})

module.exports = router;