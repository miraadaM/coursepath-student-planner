//hardcoding data for this screen for now
let major = "Computer Science"
const majorReqs = document.getElementById("mReq");
const ksaReqs = document.getElementById("kReq");
let completedM = [];
let completedK = [];
fetchCourses();

async function fetchCourses() {
    try {
       const res = await fetch('/api/courses');
       courses = await res.json();
       displayCourses();
    } catch (error) {
       console.log('Error fetching courses', error);
    }
 }
function displayCourses(){
    courses.forEach(course=>{
        if (course.majorOrKsa=="Ksa"){
            dispKSA(course);
        }
        else if (course.majorOrKsa=="Major"){
            dispMajor(course);
        }
    })
}
function dispKSA(completedKSA) {
    const para = document.createElement("p");
    const node = document.createTextNode("done - "+toDisplay(completedKSA));
    para.appendChild(node);
    ksaReqs.appendChild(para);
    
}

function dispMajor(completedMajor) {
    const para = document.createElement("p");
    const node = document.createTextNode("done - "+toDisplay(completedMajor));
    para.appendChild(node);
    majorReqs.appendChild(para);
}

function toDisplay(course) {
      return (`${course.title} - ${course.requirement} - ${course.status}. It is ${course.majorOrKsa}`);

  }
