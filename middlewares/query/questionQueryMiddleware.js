const asyncErrorWrapper = require("express-async-handler");
const {
  searchHelper,
  populateHelper,
  paginationHelper,
  questionSortHelper,
} = require("./queryMiddlewareHelpers");

const questionQueryMiddleware = function (model, options) {
  return asyncErrorWrapper(async function (req, res, next) {
    //Initial Query
    let query = model.find();
    //Search
    query = searchHelper("title", query, req);
    //populate
    if (options && options.population) {
      query = populateHelper(query, options.population);
    }
    //Sort
    query = questionSortHelper(query, req);
    //Pagination
    const paginationResult = await paginationHelper(model, query, req);

    query = paginationResult.query;

    const pagination = paginationResult.pagination;

    const queryResults = await query;

    res.queryResults = {
      success: true,
      count: queryResults.legth,
      pagination: pagination,
      data: queryResults,
    };
    next();
  });
};

module.exports = questionQueryMiddleware;
