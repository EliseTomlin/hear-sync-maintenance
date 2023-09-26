const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')

const Entry = require('../models/Entry')
//@desc show add page
//@rout GET/entries/add
router.get('/add', ensureAuth, (req,res)=>{
    // console.log('Rendering /add page')
    res.render('entries/add')
})

//@desc process add form
//@rout POST/entries
router.post('/', ensureAuth, async (req,res)=>{
    try{
        req.body.user = req.user.id
        await Entry.create(req.body)
        res.redirect('/dashboard')
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})

//@desc show all entries
//@rout GET/entries
router.get('/', ensureAuth, async (req,res)=>{
    try{
        const entries = await Entry.find({visibility: 'public'})
            .populate('user')
            .sort({createdAt: 'desc'})
            .lean()

        res.render('entries/index', {
            entries, 
        })
    }catch (err){
        console.error(err)
        res.render('error/500')
    }

})

//@desc show single entry
//@rout GET/:id/
router.get('/:id', ensureAuth, async (req,res)=>{
    try{
        let entry = await Entry.findById(req.params.id)
        .populate('user')
        .lean()

        if(!entry){
            return res.render('error/404')
        }
        res.render('entries/show',{
            entry
        })
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})


//@desc show edit page
//@rout GET/entries/edit/:id
router.get('/edit/:id', ensureAuth, async (req,res)=>{
    try{
    const entry =await Entry.findOne({
        _id: req.params.id
    }).lean()
    if(!entry){
    res.render('error/404')
    }

    if(entry.user != req.user.id){
        res.redirect('/entries')
    }else{
        res.render('entries/edit', {
            entry, 
        })
    }
    }catch(err){
        console.error(err)
        return res.render('error/500')
    }
})

//@desc update entry
//@rout PUT/entries/:id
router.put('/:id', ensureAuth, async (req,res)=>{
    try{
    let entry = await Entry.findById(req.params.id).lean()

        if (!entry){
            return res.render('error/404')

        }
        if (entry.user != req.user.id){
            res.redirect('/entries')
        }else{
            entry= await Entry.findOneAndUpdate({_id: req.params.id}, req.body,{
                new: true,
                runValidators: true
               
            })
            res.redirect('/dashboard')
        }
    }catch(err){
        console.error(err)
        return res.render('error/500')
    }
    })

//@desc delete entry
//@route DELETE/entries/:id
router.delete('/:id', ensureAuth, async (req,res)=>{
    try{
        await Entry.deleteOne({_id: req.params.id})
        res.redirect('/dashboard')
    }catch (err){
        console.error(err)
        return res.render('error/500')
    }
})

//@desc User Entries
//@rout GET/entries/user/userId
router.get('/user/:userId', ensureAuth, async (req,res)=>{
    try{
        const entries = await Entry.find({
            user:req.params.userId,
            visibility: { $in: ['public', 'shared'] }

        })
        .populate('user')
        .lean()

        res.render('entries/index',{
            entries
        })
    }catch (err){
        console.error(err)
        res.render('error/500')
    }
})



module.exports =router