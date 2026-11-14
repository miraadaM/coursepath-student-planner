import express from 'express'
import Course from '../models/course_model.js';
//import { randomUUID } from "crypto";

const router=express.Router();


router.post('/', async(req,res)=>{
  try{
  let title = req.body.title; 
  let requirement= req.body.requirement;
  let majorOrKsa = req.body.majorOrKsa;
  let status= req.body.status;
  const newCourse=new Course({
    title: title,
    requirement: requirement,
    majorOrKsa: majorOrKsa,
    status: status
  });
  const savedCourse = await newCourse.save();
  res.status(201).json(savedCourse);
} catch(err) {
  res.status(400).json({message: err.message});
}
})

router.get('/', async(req,res)=>{
  try{
  const courses = await Course.find()
  const sortBy=req.query.sortBy;
  const order=req.query.order;
  console.log(sortBy, order);
  let sortedCourses=courses.slice();
  if(sortBy==='title'){
    sortedCourses.sort(function(a,b){
      if(order==='desc'){
        return b.title.localeCompare(a.title);
      } else{
        return a.title.localeCompare(b.title);
      }
    })
  }

  res.json(sortedCourses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Course.findById(id);
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ msg: `course with id ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server err', error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const newname = req.body.title;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { title: newname },
      { new: true }
    );

    if (updatedCourse) {
      res.status(200).json(updatedCourse);
    } else {
      res.status(404).json({ msg: `course with id ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server err', error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ msg: `course with id ${id} not found` });
    }

    res.status(200).json({ msg: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server err', error: error.message });
  }
});


export default router;
