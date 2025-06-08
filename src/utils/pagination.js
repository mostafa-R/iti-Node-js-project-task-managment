export async function paginate(model, filter = {}, option = {}) {
  const page = parseInt(option.page) || 1;
  const limit = parseInt(option.limit) || 10;
  const skip = (page - 1) * limit;

  const data = await model
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort(option.sort || { createdAt: -1 });

  const total = await model.countDocuments(filter);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}
