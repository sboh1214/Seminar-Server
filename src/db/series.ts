import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Model,
  Optional,
  Sequelize,
} from 'sequelize'
import User from './user'

interface SeriesAttributes {
  id: number
  title: string
  description?: string | null

  seminars: [number]
}

interface SeriesCreationAttributes extends Optional<SeriesAttributes, 'id'> {}

export default class Series
  extends Model<SeriesAttributes, SeriesCreationAttributes>
  implements SeriesAttributes
{
  public id!: number
  public title: string
  public description?: string | null

  public seminars: [number]

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getUser!: HasManyGetAssociationsMixin<User>
  public addUser!: HasManyAddAssociationMixin<User, string>
  public hasUser!: HasManyHasAssociationMixin<User, string>
  public countUser!: HasManyCountAssociationsMixin
  public createUser!: HasManyCreateAssociationMixin<User>

  public readonly users?: User[]
}

export function initSeries(sequelize: Sequelize) {
  Series.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      seminars: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Series',
      tableName: 'Series',
      freezeTableName: true,
    },
  )
}
