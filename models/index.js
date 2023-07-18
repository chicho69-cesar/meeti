import Category from './Category.js'
import Comment from './Comment.js'
import Group from './Group.js'
import Meeti from './Meeti.js'
import User from './User.js'

Comment.belongsTo(User, {
  foreignKey: 'userId'
})

Comment.belongsTo(Meeti, {
  foreignKey: 'meetiId'
})

Group.belongsTo(Category, {
  foreignKey: 'categoryId'
})

Group.belongsTo(User, {
  foreignKey: 'userId'
})

Meeti.belongsTo(User, {
  foreignKey: 'userId'
})

Meeti.belongsTo(Group, {
  foreignKey: 'groupId'
})

export {
  Category,
  Comment,
  Group,
  Meeti,
  User,
}
