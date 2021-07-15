const Item = require('./models/item')
require('dotenv').config();
const express = require('express');
const app = express ();
const mongoose = require('mongoose')
const mongodb=process.env.MONGO_DB
////////////////////////////////////////////////////////////
mongoose.connect(mongodb , {useNewUrlParser:true , useUnifiedTopology :true})
.then(()=>{
    console.log('connected');
    app.listen(3000);
})
.catch((err)=>{
    console.log(err);
})
////////////////////////////////////////////////////////////////////////////////////
app.set('view engine','ejs');

app.use(express.urlencoded({extended:true}));



app.get('/', (req , res)=>{
    res.redirect('/get-items')
})

app.get('/get-items', (req , res)=>{
    Item.find().then(result=> res.render('index', {items:result}))
    .catch((err)=>console.log(err))
})

app.get('/add-item', (req , res)=>{
    res.render('add-item');
})

app.get('/items/:id', (req , res)=>{
   const id = req.params.id ; 
   Item.findById(id)
   .then((result)=>{
       res.render('item-details',{item:result});
   })
})

app.delete('/items/:id', (req , res)=>{
    const id = req.params.id ; 
    Item.findByIdAndDelete(id)
    .then((result)=>{

        res.json({redirect : '/get-items'})
    })
 })

app.post('/items', (req , res)=>{
    console.log(req.body);
    const item = Item(req.body);
    item.save()
    .then(()=>{
        res.redirect('./get-items')
    })
    .catch((err)=>console.log(err))
})

app.put('/items/:id', (req , res)=>{
    const id = req.params.id ; 
    Item.findByIdAndUpdate(id,req.body)
    .then((result)=>{

        res.json({message : 'Updated Successfully'})
    })
 })

app.use( (req , res)=>{
    res.render('error');
})

