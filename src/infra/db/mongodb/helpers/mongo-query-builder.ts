export class MongoQueryBuilder {
  private readonly query: object[] = []

  match (data: object): MongoQueryBuilder {
    this.query.push({ $match: data })
    return this
  }

  group (data: object): MongoQueryBuilder {
    this.query.push({ $group: data })
    return this
  }

  unwind (data: object): MongoQueryBuilder {
    this.query.push({ $unwind: data })
    return this
  }

  lookup (data: object): MongoQueryBuilder {
    this.query.push({ $lookup: data })
    return this
  }

  addFields (data: object): MongoQueryBuilder {
    this.query.push({ $addFields: data })
    return this
  }

  project (data: object): MongoQueryBuilder {
    this.query.push({ $project: data })
    return this
  }

  sort (data: object): MongoQueryBuilder {
    this.query.push({ $sort: data })
    return this
  }

  build (): object[] {
    return this.query
  }
}
