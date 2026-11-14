import mongoose  from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
       type: String,
       required: true
    },
    requirement: {
       type: String,
       required: true
    },
    majorOrKsa: {                 
      type: String,
      required: true
    },
    status: {
       type: String,
       required: true
    }
 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
