
const pool = require('./db');
const bodyParser=require('body-parser');
const { body, validationResult } = require('express-validator');
const express = require('express');
const app = express();
const port = 3000;
app.use(bodyParser.json());

const cors = require('cors');

//const app = require('express')();

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow DELETE
}));

app.options('*', cors()); // Handle preflight requests




app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE"); // Allow specific methods
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Allow specific headers
    next();
});


app.get('/', (req, res) => {
    res.send('<h1> <center> DIGIMENU CARD </center>  </h1>')
})

app.get('/menucard', async (req, res) => {
    try{
        const result = await pool.query('select menu_name, menu_price, group_name, qty_type from menu, food_group, qtymast where food_group.gid=menu.gid and menu.qid=qtymast.qid order by menu_price desc');
       // res.json({status:"200",menucard:result.rows});
       res.json({status:'200', message: 'success', menucard:result.rows});
    } catch (err){
        //console.error(err.message);
        console.log(err.message)
        res.status(500).send('Server Error');
    }
});




app.get('/menu', async (req, res) => {
    try{
        const result = await pool.query('select * from menu');
        res.json({status:"200",menulist:result.rows});
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.delete('/delmenu',[
    body('id').notEmpty().withMessage('id is required'),
],     async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
      else{
        const { id } = req.body;
        const rs = await pool.query('select * from menu where mid=$1',[id]);
        if(rs.rows.length>0){
        await pool.query('delete from menu where mid=$1',[id]);
        //res.json(result.rows);
        res.send({status: "200", message:"Delete Success "});
    } else{
        res.send({status: "400", message:"Delete Failed "});
    }
}
}    catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



app.get('/menuByid', async (req, res)=> {
    try {
        const {id}=req.body;
        const result =await pool.query('select * from menu where mid=$1',[id]);
    res.json(result.rows);
    }catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }
});






//-------------------validation---------------
app.get('/menuid', [
    body('id').notEmpty().withMessage('id is required'),
],    async (req, res) => {
    try{  // Handle validation error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
      else{   // if validation passes, procced with the request
        const {id} = req.body;
        const result = await pool.query('SELECT * from menu where mid=$1',[id]);
        if ( result.rows.length>0){
           // res.json(result.rows);
            res.json({status: "200", message:"Success", data: result.rows});
        }else {

            //res.json({ message:'No data found'});
            res.json({status: "400", message:"No data found"});
        }
          }
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});





app.post('/addmenu', async (req, res) => {
    try{
        const { menu_name, menu_price,gid,qid }=req.body;
           const result = await pool.query(' insert into menu (menu_name, menu_price,gid,qid)values($1,$2,$3,$4) RETURNING *',
            [  menu_name, menu_price,gid,qid ] );
        //res.json(result.rows);
        res.send({ status:"200",message:"Save Success "})
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



app.put('/updatemenu', [
    body('menu_name').notEmpty().withMessage('menu_name is required'),
    body('menu_price').notEmpty().withMessage('menu_price is required'),
    body('gid').notEmpty().withMessage('gd is required'),
    body('qid').notEmpty().withMessage('qid is required'),
    body('mid').notEmpty().withMessage('mid is required'),

],    async (req, res) => {
    try{
        const errors = validationResult(req);
        const { menu_name, menu_price,gid,qid,mid } = req.body;
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          } else{ 
        // const { menu_name, menu_price,gid,qid,mid } = req.body;
        const rs = await pool.query('select * from menu where mid=$1',[mid]);

        if(rs.rows.length>0){
         await pool.query(' update menu set menu_name=$1,menu_price=$2,gid=$3,qid=$4 where mid=$5',
            [ menu_name, menu_price,gid,qid,mid ] );
            res.json({status: "200", message:"Update Success "});
        } else{
            res.json({status: "400", message:" Update Failed "});
        
         }  
    } 
}catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//--------------------Food_Group----------


app.get('/food_group', async (req, res) => {
    try{
        const result = await pool.query('select * from food_group');
        res.json({status:"200",foodgroup:result.rows});
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//-------------------validation---------------
app.get('/foodgroupid', [
    body('id').notEmpty().withMessage('id is required'),
],    async (req, res) => {
    try{  // Handle validation error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
      else{   // if validation passes, procced with the request
        const {id} = req.body;
        const result = await pool.query('SELECT * from food_group where gid=$1',[id]);
        if ( result.rows.length>0){
           // res.json(result.rows);
            res.json({status: "200", message:"Success", data: result.rows});
        }else {

            //res.json({ message:'No data found'});
            res.json({status: "400", message:"No data found"});
        }
          }
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.delete('/delfoodgroup',[
    body('id').notEmpty().withMessage('id is required'),
],     async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
      else{
        const { id } = req.body;
        const rs = await pool.query('select * from food_group where gid=$1',[id]);
        if(rs.rows.length>0){
        await pool.query('delete from food_group where gid=$1',[id]);
        //res.json(result.rows);
        res.send({status: "200", message:"Delete Success "});
    } else{
        res.send({status: "400", message:"Delete Failed "});
    }
}
}    catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.put('/updatefoodgroup', [
    body('group_name').notEmpty().withMessage('group_name is required'),
    body('gid').notEmpty().withMessage('gid is required'),
   

],    async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          } else{ 
        const { group_name, gid } = req.body;
        const rs = await pool.query('select * from food_group where gid=$1',[gid]);
        if(rs.rows.length>0){
         await pool.query(' update food_group set group_name=$1 where gid=$2',
            [ group_name, gid ] );
            res.send({status: "200", message:"Update Success "});
        } else{
            res.send({status: "400", message:" Update Failed "});
        
         }  
    } 
}catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.post('/addfoodgroup', [
    body('group_name').notEmpty().withMessage('group_name is required')
],
    async (req, res) => {
    try{const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          } else{
        const { group_name }=req.body;
           const result = await pool.query(' insert into food_group (group_name)values($1) RETURNING *',
            [  group_name ] );
       // res.json(result.rows.length);
        res.send({ status:"200",message:" Food group Save Success "})
    } 
}catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//----------------qtymast-----------


app.post('/addqty', [
    body('qty_type').notEmpty().withMessage('qty_type is required')
],
    async (req, res) => {
    try{const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          } else{
        const { qty_type } = req.body;

           const result = await pool.query(' insert into qtymast (qty_type)values($1) RETURNING *',
            [  qty_type ] );
      // res.json(result.rows.length);

        res.send({ status:"200",message: " Qtymast Save Success "})
    } 
}catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.put('/updateqty', [
    body('qty_type').notEmpty().withMessage('qty_type is required'),
    body('qid').notEmpty().withMessage('qid is required'),
   ],    async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          } else{ 
        const { qty_type, qid } = req.body;
        const rs = await pool.query('select * from qtymast where qid=$1',[qid]);
        if(rs.rows.length>0){
         await pool.query(' update qtymast set qty_type=$1 where qid=$2',
            [ qty_type, qid ] );
            res.send({status: "200", message:" QTYMAST Update Success "});
        } else{
            res.send({status: "400", message:" QTYMAST74 Update Failed "});
        
         }  
    } 
}catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



app.delete('/delqty',[
    body('qid').notEmpty().withMessage('qid is required'),
],     async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
      else{
        const { qid } = req.body;
        const rs = await pool.query('select * from qtymast where qid=$1',[qid]);
        if(rs.rows.length>0){
        await pool.query('delete from qtymast where qid=$1',[qid]);
        //res.json(result.rows);
        res.send({status: "200", message:" QTYMAST Delete Success "});
    } else{
        res.send({status: "400", message:" QTYMAST Delete Failed "});
    }
}
}    catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.get('/qtymast', async (req, res) => {
    try{
        const result = await pool.query('select * from qtymast');
        res.json({status:"200",qtymast:result.rows});
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



app.get('/qtymastid', [
    body('qid').notEmpty().withMessage('qid is required'),
],    async (req, res) => {
    try{  // Handle validation error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
      else{   // if validation passes, procced with the request
        const {qid} = req.body;
        const result = await pool.query('SELECT * from qtymast where qid=$1',[qid]);
        if ( result.rows.length>0){
           // res.json(result.rows);
            res.json({status: "200", message:"Success", data: result.rows});
        }else {

            //res.json({ message:'No data found'});
            res.json({status: "400", message:"No data found"});
        }
          }
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




 app.listen(port, () => {
     console.log(`Server running at http://localhost:${port}`);
   });

