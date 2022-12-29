/* 
  if there is an error thrown in the DB, asyncMiddleware
  will pass it to next() and express will handle the error */
import raw from "../../middleware/route.async.wrapper.mjs";
import user_model from "./user.model.mjs";
import express from "express";
import log from "@ajar/marker";
import validateUser from '../../middleware/validateUser.mjs';

const router = express.Router();

// parse json req.body on post routes
router.use(express.json());

// CREATES A NEW USER
// router.post("/", async (req, res,next) => {
//    try{
//      const user = await user_model.create(req.body);
//      res.status(200).json(user);
//    }catch(err){
//       next(err)
//    }
// });

// CREATES A NEW USER
router.post(
	"/", validateUser,
	raw(async (req, res) => {
		const user = await user_model.create(req.body);
		res.status(200).json(user);
	})
);

// GET ALL USERS
router.get(
	"/",
	raw(async (req, res) => {

		// 1. Add query parameters to the route to specify (and read) the page number and page size:
		const page = parseInt(req.query.page) || 1;
		const items = parseInt(req.query.items) || 10;

		const users = await user_model
			.find()
			.select(
				`-_id
          first_name 
          last_name
          email 
          phone`
			)

			// 2. Skip the specified number of documents
			.skip((page - 1) * items)
			// Limit the number of documents returned
			.limit(items);

		/* The countDocuments() method is a method of the MongoDB query object.
			It is used to count the number of documents in a collection that match a given query. 
			It returns a Promise that resolves to the number of documents,
			which the client can use to build a pagination UI.
		*/
		const totalDocuments = await user_model.countDocuments();
		// Calculate the total number of pages
		const totalPages = Math.ceil(totalDocuments / items);

		// Return the paginated data to the client
		res.status(200).json({
			data: users,
			meta: {
				page,
				items,
				totalDocuments,
				totalPages,
			},
		});
	})
);

// GETS A SINGLE USER
router.get(
	"/:id",
	raw(async (req, res) => {
		const user = await user_model.findById(req.params.id);
		// .select(`-_id
		//     first_name
		//     last_name
		//     email
		//     phone`);
		if (!user) return res.status(404).json({ status: "No user found." });
		res.status(200).json(user);
	})
);
// UPDATES A SINGLE USER
router.put(
	"/:id", validateUser,
	raw(async (req, res) => {
		const user = await user_model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			upsert: true,
		});
		res.status(200).json(user);
	})
);

// DELETES A USER
router.delete(
	"/:id",
	raw(async (req, res) => {
		const user = await user_model.findByIdAndRemove(req.params.id);
		if (!user) return res.status(404).json({ status: "No user found." });
		res.status(200).json(user);
	})
);

export default router;
