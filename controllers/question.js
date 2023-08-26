const Question = require("../models/Question");
const asyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
  const information = req.body;

  const question = await Question.create({
    ...information, //spread operator
    user: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: question,
  });
});

const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {


  return res.status(200).json(res.queryResults);
});

const getSingleQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const question = await Question.findById(id);

  return res.status(200).json({
    success: true,
    data: question,
  });
});

const editQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  let question = await Question.findByIdAndUpdate(id);

  question.title = title;
  question.content = content;

  question = await question.save();

  return res.status(200).json({
    success: true,
    data: question,
  });
});

const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  let question = await Question.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Delete Operation Succesfull",
  });
});

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  let question = await Question.findById(id);

  if (question.likes.includes(req.user.id)) {
    return next(new CustomError("You already liked this question.", 400));
  }

  question.likes.push(req.user.id);

  question.likeCount = question.likes.length;

  await question.save();
  return res.status(200).json({
    success: true,
    data: question,
  });
});

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  let question = await Question.findById(id);

  if (!question.likes.includes(req.user.id)) {
    return next(
      new CustomError("You can not undo like operation for this question", 400)
    );
  }

  const updatedLikes = [];
  for (const like of question.likes) {
    if (like.toString() !== req.user.id) {
      updatedLikes.push(like);
    }
  }
  question.likes = updatedLikes;

  question.likeCount = question.likes.length;

  await question.save();
  return res.status(200).json({
    success: true,
    data: question,
  });
});
module.exports = {
  askNewQuestion,
  getAllQuestions,
  getSingleQuestion,
  editQuestion,
  deleteQuestion,
  likeQuestion,
  undoLikeQuestion,
};
