export async function paginate(model, filter = {}, option = {}) {
  const page = parseInt(option.page);
  const limit = parseInt(option.limit);
  const sort = option.sort || { createdAt: -1 };

  if (isNaN(page) || isNaN(limit)) {
    const [data, total] = await Promise.all([
      model.find(filter).sort(sort),
      model.countDocuments(filter),
    ]);
    return { data, total };
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(filter).skip(skip).limit(limit).sort(sort),
    model.countDocuments(filter),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}
