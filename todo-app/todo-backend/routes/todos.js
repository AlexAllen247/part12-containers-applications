const express = require("express");
const { Todo } = require("../mongo");
const redis = require('../redis');
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  let todosCount = await redis.getAsync('added_todos');
  todosCount = todosCount ? parseInt(todosCount) : 0;
	await redis.setAsync('added_todos', todosCount + 1);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.status(200).send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const todo = {
    text: req.body.text,
    done: req.body.done,
  };

  const updateTodo = await Todo.findByIdAndUpdate(req.body.id, todo, {
    new: true,
    runValidators: true,
    context: "query",
  });
  res.send(updateTodo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
