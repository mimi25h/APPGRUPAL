function findById(model, id) {
  return model.findById(id);
}

function findOne(model, query) {
  return model.findOne(query);
}

module.exports = {
  findById,
  findOne,
};
