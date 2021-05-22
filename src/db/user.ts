import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

interface UserAttributes {
  email: string
  secret: string
  firstName?: string | null
  lastName?: string | null
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
  public firstName!: string | null
  public lastName!: string | null
  public isAdmin: boolean = false
  public isSpeaker: boolean = false

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
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
      firstName: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      lastName: {
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
    },
  )
}
