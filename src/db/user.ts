import {
  Association,
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
import Seminar from './seminar'
import Series from './series'

interface UserAttributes {
  email: string
  secret: string
  name?: string | null
  isAdmin?: boolean
  isSpeaker?: boolean
}

interface UserCreationAttributes extends Optional<UserAttributes, 'email'> {}

export default class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public email!: string
  public secret!: string
  public name!: string | null
  public isAdmin: boolean = false
  public isSpeaker: boolean = false

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getSeminar!: HasManyGetAssociationsMixin<Seminar>
  public addSeminar!: HasManyAddAssociationMixin<Seminar, number>
  public hasSeminar!: HasManyHasAssociationMixin<Seminar, number>
  public countSeminar!: HasManyCountAssociationsMixin
  public createSeminar!: HasManyCreateAssociationMixin<Seminar>

  public readonly seminars?: Seminar[]

  public getSeries!: HasManyGetAssociationsMixin<Series>
  public addSeries!: HasManyAddAssociationMixin<Series, number>
  public hasSeries!: HasManyHasAssociationMixin<Series, number>
  public countSeries!: HasManyCountAssociationsMixin
  public createSeries!: HasManyCreateAssociationMixin<Series>

  public readonly series?: Series[]

  public static associations: {
    seminars: Association<User, Seminar>
    series: Association<User, Series>
  }
}

export function initUser(sequelize: Sequelize) {
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      secret: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isSpeaker: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
    },
  )
}

export function createAssociations() {
  User.belongsToMany(Seminar, { through: 'UserSeminar' })
  Seminar.belongsToMany(User, { through: 'UserSeminar' })
  User.belongsToMany(Series, { through: 'UserSeries' })
  Series.belongsToMany(User, { through: 'UserSeries' })
}
