exports.getPagination = (page, size) => {
    const limit = size ? +size : 100;
    const offset = page ? (page - 1) * limit : 0;
  
    return { limit, offset };
  };
  
  exports.getPaginationData = (data, page, limit) => {
    const { totalRecords: totalItems, docs } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
  
    return {
      data: docs,
      ...(limit
        ? { pagination: { totalItems, totalPages, currentPage, pageSize: limit } }
        : {}),
    };
  };
  
  exports.getCount = async (Model, whereClause = null) => {
    if (whereClause) {
      return await Model.countDocuments(whereClause);
    }
    return await Model.estimatedDocumentCount();
  };