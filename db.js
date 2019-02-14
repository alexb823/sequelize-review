const Sequelize = require('sequelize');

// const db = new Sequelize(process.env.DATABASE_URL, {logging: false});

// For cloud9 db
const db = new Sequelize('ubuntu', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Role = db.define('role', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});


//Define many-to-many association 
User.belongsToMany(Role, {through: 'memberships'});
Role.belongsToMany(User, {through: 'memberships'});

//Seed the data
const syncAndSeed = () => {
  return db.sync({ force: true })
    .then(async() => {
      const [moe, larry] = await Promise.all([
        User.create({ name: 'moe' }),
        User.create({ name: 'larry' })
      ]);
      const [admin, engineering] = await Promise.all([
        Role.create({ name: 'admin' }),
        Role.create({ name: 'engineering' })
      ]);
      
      await moe.addRoles([engineering, admin]);
      await larry.addRole(admin);
      // await moe.setRoles([]);
      
      return User.findOne({
        where: {
          name: 'larry'
        },
        include: [Role]
      })
      .then(larry => {
        console.log(larry.name, larry.roles[0].name)
      })
      
    })
}


// //Define many-to-many association using intermediary model
// const Membership = db.define('membership', {
//   primary: {
//     type: Sequelize.BOOLEAN,
//     defaultValue: false
//   }
// });

// Membership.belongsTo(User);
// Membership.belongsTo(Role);
// User.hasMany(Membership);

// //Seed the data
// const syncAndSeed = () => {
//   return db.sync({ force: true })
//     .then(async() => {
//       const [moe, larry] = await Promise.all([
//         User.create({ name: 'moe' }),
//         User.create({ name: 'larry' })
//       ]);
//       const [admin, engineering] = await Promise.all([
//         Role.create({ name: 'admin' }),
//         Role.create({ name: 'engineering' })
//       ]);

//       return Promise.all([
//         Membership.create({ userId: larry.id, roleId: engineering.id, primary: true }),
//         Membership.create({ userId: larry.id, roleId: admin.id })
//       ])
//     })
//     .then(() => {
//       return User.findOne({
//         where: { name: 'larry' },
//         include: [{
//           model: Membership,
//           include: Role
//           }]
//       });
//     })
//     .then(larry => {
//       console.log(larry.memberships[1].role.name)
//     })
// }

// //Define Belongs to many association using alias
// Role.belongsTo(User, { as: 'manager' });
// User.hasMany(Role, { as: 'manages', foreignKey: 'managerId' })
// //Seed the data
// const syncAndSeed = () => {
//   return db.sync({ force: true })
//     .then(async() => {
//       const [moe, larry] = await Promise.all([
//         User.create({ name: 'moe' }),
//         User.create({ name: 'larry' })
//       ]);
//       const [admin, engineering] = await Promise.all([
//         Role.create({ name: 'admin', managerId: moe.id }),
//         Role.create({ name: 'engineering', managerId: larry.id })
//       ]);

//       return Role.findAll({
//         include: [{
//           model: User,
//           as: 'manager'
//         }]
//       });
//     })
//     .then(roles => {
//       console.log(roles[0].manager.get());
//       return User.findAll({
//         include: [{
//           model: Role,
//           as: 'manages'
//         }]
//       });
//     })
//     .then(users => {
//       console.log(users[0].manages)
//     })
// }

syncAndSeed();
