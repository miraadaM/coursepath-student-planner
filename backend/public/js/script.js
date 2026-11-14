let courses = [];

const courseList = document.getElementById("courseList");
const searchInput = document.getElementById("search");
const progressBar = document.getElementById("progressBar");

const form = document.querySelector('#courseForm');

let displayDiv = document.createElement('div');
form.after(displayDiv);

// adds courses
async function addCourses(e) {
   e.preventDefault();

   const courseName = document.getElementById("courseName").value;
   const requirement = document.getElementById("requirement").value;
   const majorOrKsa = document.getElementById("majorOrKsa").value;
   const status = document.getElementById("status").value;
  

   const course = {
      courseName: courseName,
      requirement: requirement,
      majorOrKsa: majorOrKsa,
      status: status
   };

   try {
      const res = await fetch('/api/courses', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(course) //converts into json format
      });

      const newCourse = await res.json();

      displayDiv.innerHTML = `Course ${newCourse.title} added`;

      fetchCourses(); // refresh list
   } catch (error) {
      console.log('Error:', error);
   }
}


form.addEventListener('submit', addCourses);


async function fetchCourses() {
   try {
      const res = await fetch('/api/courses');
      courses = await res.json();

      displayCourses(courses);
      updateProgress();
   } catch (error) {
      console.log('Error fetching courses', error);
   }
}


function displayCourses(list) {
  courseList.innerHTML = "";

  list.forEach(course => {
    let li = document.createElement("li");

    li.innerHTML = `
      ${course.title} - ${course.requirement} - ${course.status} ${course.majorOrKsa}
      <button onclick="editCourse('${course._id}', '${course.title}')">Edit</button>
      <button onclick="deleteCourse('${course._id}')">Delete</button>
    `;

    courseList.appendChild(li);
  });
}

async function deleteCourse(id) {
  try {
    await fetch(`/api/courses/${id}`, {
      method: 'DELETE'
    });

    fetchCourses(); 
  } catch (error) {
    console.log('Delete error:', error);
  }
}

async function editCourse(id, oldTitle) {
  const newTitle = prompt("Enter new course name:", oldTitle);

  if (!newTitle) return;

  try {
    await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: newTitle })
    });

    fetchCourses(); 
  } catch (error) {
    console.log('Update error:', error);
  }
}


document.getElementById("searchBtn").addEventListener("click", function () {
  let searchValue = searchInput.value.toLowerCase();

  let foundCourses = courses.filter(c =>
    c.title.toLowerCase() === searchValue
  );

  if (foundCourses.length > 0) {
    displayCourses(foundCourses);
  } else {
    courseList.innerHTML = "<li>Course not found</li>";
  }
});


function updateProgress() {
  let completed = courses.filter(c => c.status === "completed").length;

  progressBar.max = 32;
  progressBar.value = completed;
  
}


fetchCourses();
