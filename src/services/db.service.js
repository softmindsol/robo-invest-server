import httpErrors from 'http-errors';

export class DBQuery {
  model;

  constructor(model) {
    this.model = model;
  }

  async getAll() {
    return await this.model.find({});
  }

  async getById(id, fields) {
    const doc = await this.model.findById(id).select(fields);
    if (!doc) throw httpErrors(404, `${this.model.modelName} not found`);
    return doc;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true });
    if (!doc) throw httpErrors(404, `${this.model.modelName} not found`);
    return doc;
  }

  async delete(id) {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw httpErrors(404, `${this.model.modelName} not found`);
    return doc;
  }

  async deleteMany(query) {
    return await this.model.deleteMany(query);
  }

  async aggregate(pipeline) {
    return await this.model.aggregate(pipeline);
  }

  async countDocuments(query) {
    return await this.model.countDocuments(query);
  }

  async findOne(query, projection = '') {
    return await this.model.findOne(query).select(projection);
  }

  async find(
    query = {},
    limit = 12,
    page = 1,
    projection = null,
    options = {}
  ) {
    limit = parseInt(limit);
    page = parseInt(page);

    const result = await this.model
      .find(query, projection, options)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await this.model.countDocuments(query);

    return {
      pages: Math.ceil(count / limit),
      total: count,
      data: result
    };
  }

  async findById(id) {
    const doc = await this.model.findById(id);
    if (!doc) throw httpErrors(404, `${this.model.modelName} not found`);
    return doc;
  }

  async findByIdAndUpdate(id, data, options = { new: true }) {
    const doc = await this.model.findByIdAndUpdate(id, data, options);
    if (!doc) throw httpErrors(404, `${this.model.modelName} not found`);
    return doc;
  }

  async findByIdAndDelete(id) {
    const doc = await this.model.findByIdAndDelete(id);
    if (!doc) throw httpErrors(404, `${this.model.modelName} not found`);
    return doc;
  }

  async findOneAndUpdate(query, update, options = { new: true }) {
    const doc = await this.model.findOneAndUpdate(query, update, options);
    if (!doc) throw httpErrors(404, `${this.model.modelName} not found`);
    return doc;
  }

  async findOneAndDelete(query) {
    const doc = await this.model.findOneAndDelete(query);
    if (!doc) throw httpErrors(404, `${this.model.modelName} not found`);
    return doc;
  }

  async removeAccessToken(userId, accessToken) {
    const doc = await this.model.findOneAndUpdate(
      { _id: userId, accessToken },
      { $pull: { accessToken } },
      { new: true }
    );
    if (!doc)
      throw httpErrors(
        404,
        `${this.model.modelName} not found or token invalid`
      );
    return doc;
  }
}
