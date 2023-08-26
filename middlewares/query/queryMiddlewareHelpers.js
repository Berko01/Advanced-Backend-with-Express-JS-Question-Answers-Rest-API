const searchHelper = (searchKey, query, req) => {
  //search
  if (req.query.search) {
    const searchObject = {};

    const regex = new RegExp(req.query.search, "i");
    searchObject[searchKey] = regex;

    return (query = query.where(searchObject));
  }
  return query;
};

const populateHelper = (query, population) => {
  return query.populate(population);
};

const questionSortHelper = (query, req) => {
  //Sort : req.query.sortBy most-answered most-liked

  const sortKey = req.query.sortBy;

  if (sortKey === "most-answered") {
    return query = query.sort("-answerCount");
  }
  if (sortKey === "most-liked") {
    return query = query.sort("-likeCount");
  }
  return query.sort("-createdAt");

};

const paginationHelper = async (model,query,req) =>{
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
  
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    const pagination = {};
    const total = await model.countDocuments();
  
    if (startIndex > 0) {
      pagination.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }

    return {
      query: query.skip(startIndex).limit(limit),
      pagiantion: pagination
    }
  
    
    //1 2 3 4 5 6 7 8 9 10 - 10 tane
    //skip(2)
    //limit(2)
}

module.exports = {
  searchHelper,
  populateHelper,
  questionSortHelper,
  paginationHelper
};