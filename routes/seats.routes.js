//seats
const express = require('express');
const router = express.Router();
const db = require('./../db');



// get all seats
router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

//get one random seat
router.route('/seats/random').get((req, res) => {
  const random = Math.floor(Math.random() * db.seats.length)
  res.json(db.seats[random])
})

// get one seat
router.route('/seats/:id').get((req, res) => {
  const id = Number(req.params.id)
	const seat = db.seats.find(element => element.id === id)
	if (!seat) {
		return res.status(404).json({ message: 'Invalid ID' })
	}
	res.json(seat)
});

// post one seat to db and veryfication if seat are taken
router.route('/seats').post((req, res) => {
	const { day, seat } = req.body
	const isTaken = db.seats.some(item => (item.seat === seat && item.day === day));
	
	if (isTaken) {
		res.status(409).json({ message: 'The slot is already taken...' })
	} else {
		const id = db.seats[db.seats.length - 1].id + 1
		const newSeat = Object.assign({ id: id }, req.body)
		db.seats.push(newSeat)
		
		// emit action by socket
		req.io.emit('seatsUpdated', db.seats);
		res.status(201).json({ message: 'OK' });
	}
});

// change one seat on db
router.route('/seats/:id').put((req, res) => {
	const { author, text } = req.body
	const id = Number(req.params.id)
	const seat = db.seats.find(element => element.id === id)
	const index = db.seats.indexOf(seat)
	if (!seat) {
		return res.status(404).json({ message: 'Invalid ID' })
	} else {
		db.seats[index] = { ...seat, author, text }
		res.json({ message: 'data changed' })
	}
})

// Remove one seat from db
router.route('/seats/:id').delete((req, res) => {
	const id = Number(req.params.id)
	const seat = db.seats.find(element => element.id === id)
	const index = db.seats.indexOf(seat)

	if (!seat) {
		return res.status(404).json({ message: 'Invalid ID' })
	} else {
		db.seats.splice(index, 1)
		res.json({ message: 'OK, deleted' })
	}
})

module.exports = router;