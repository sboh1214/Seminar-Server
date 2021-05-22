import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

interface SeriesAttributes {
  id: number
}

interface SeriesCreationAttributes extends Optional<SeriesAttributes, 'id'> {}

export default class Series
  extends Model<SeriesAttributes, SeriesCreationAttributes>
  implements SeriesAttributes
{
  public id!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

export function initSeries(sequelize: Sequelize) {
  Series.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: 'Series',
    },
  )
}
