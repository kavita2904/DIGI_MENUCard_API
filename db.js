const {Pool }= require('pg');
// create a new poll instance
const pool= new Pool ( {
     user: 'postgres',
     host: 'localhost',
     database: 'kavi1',
     password: 'kavi29',
     port: 5432
}); module.exports = pool;
    
// const {Pool }= require('pg');
// const  pool =  new Pool ({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'kavi1',
//     password: 'kavi29',
//     port: 5432
     
// }); module.exports = pool;