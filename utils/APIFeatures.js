class APIFeatures {
  constructor(model, queryObj) {
    this.model = model;
    this.queryObj = queryObj;
  }

  filter() {
    const queryObjCopy = { ...this.queryObj };
    const excludedObj = ["fields", "limit", "sort", "page"];
    excludedObj.forEach((el) => delete queryObjCopy[el]);
    const filterQueryStr = JSON.stringify(queryObjCopy).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.model.find(JSON.parse(filterQueryStr));
    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortQuery = this.queryObj.sort.split(",").join(" ");
      this.query = this.query.sort(sortQuery);
    }
    return this;
  }

  select() {
    if (this.queryObj.fields) {
      const fieldQuery = this.queryObj.fields.split(",").join(" ");
      this.query = this.query.select(fieldQuery);
    }

    return this;
  }

  async paginate() {
    const pageNumber = this.queryObj.page * 1 || 1;
    const limit = this.queryObj.limit * 1 || 1;
    const skip = (pageNumber - 1) * limit;
    // const totalDoc = await this.model.countDocuments();
    // const maxPages = totalDoc / limit;

    // if (pageNumber > maxPages || pageNumber < 0 || limit < 0)
    //   throw new Error("This page does not exist");

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
