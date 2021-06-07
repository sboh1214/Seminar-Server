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

interface SeminarAttributes {
  id: number
  title: string
  description?: string | null
  startTime?: Date | null
  endTime?: Date | null
  onlineLink?: [string] | null
  series?: number | null
}

interface SeminarCreationAttributes extends Optional<SeminarAttributes, 'id'> {}

export default class Seminar
  extends Model<SeminarAttributes, SeminarCreationAttributes>
  implements SeminarAttributes
{
  public id!: number
  public title: string
  public description?: string | null
  public startTime?: Date | null
  public endTime?: Date | null
  public onlineLink?: [string] | null

  public series?: number | null

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getUser!: HasManyGetAssociationsMixin<User>
  public addUser!: HasManyAddAssociationMixin<User, string>
  public hasUser!: HasManyHasAssociationMixin<User, string>
  public countUser!: HasManyCountAssociationsMixin
  public createUser!: HasManyCreateAssociationMixin<User>

  public readonly users?: User[]
}

export function initSeminar(sequelize: Sequelize) {
  Seminar.init(
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
      startTime: {
        type: DataTypes.DATE,
      },
      endTime: {
        type: DataTypes.DATE,
      },
      onlineLink: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      series: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Seminar',
      tableName: 'Seminars',
      freezeTableName: true,
    },
  )
}
