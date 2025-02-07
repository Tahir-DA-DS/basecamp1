const API_BASE_URL = 'http://localhost:3000';

// Get the stored token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Fetch and display all projects
async function fetchProjects() {
  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert('Unauthorized access. Please log in again.');
      }
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const projects = await response.json();
    console.log('Fetched Projects:', projects);

    const tableBody = document.getElementById('project-table-body');
    tableBody.innerHTML = '';

    if (projects.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5">No projects found.</td></tr>';
      return;
    }

    projects.forEach((project) => {
      const row = `
        <tr>
          <td>${project.id}</td>
          <td>${project.name}</td>
          <td>${project.description}</td>
          <td>${project.userId}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="loadProjectDetails(${project.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">Delete</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    document.getElementById('project-table-body').innerHTML =
      '<tr><td colspan="5">Failed to load projects. Please try again later.</td></tr>';
  }
}

// Delete a project
async function deleteProject(projectId) {
  if (!confirm('Are you sure you want to delete this project?')) return;

  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in Authorization header
      'Content-Type': 'application/json',
      },  
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert('Unauthorized access. Please log in again.');
        // Redirect to login page or take appropriate action
      }
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    fetchProjects(); // Refresh the table
  } catch (error) {
    console.error('Error deleting project:', error);
    alert('Failed to delete the project. Please try again.');
  }
}

// Add a new project
async function addProject(event) {
  event.preventDefault();

  const name = document.getElementById('project-name').value.trim();
  const description = document.getElementById('project-description').value.trim();

  if (!name || !description) {
    alert('Both project name and description are required.');
    return;
  }

  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in Authorization header
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

   

    if (!response.ok) {
      if (response.status === 401) {
        alert('Unauthorized access. Please log in again.');
        // Redirect to login page or take appropriate action
      }
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    fetchProjects(); // Refresh the table
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProjectModal'));
    if (modal) modal.hide();
    document.getElementById('add-project-form').reset();
  } catch (error) {
    console.error('Error adding project:', error);
    alert('Failed to add the project. Please try again.');
  }
}

//edit project
// async function editProject(projectId) {

//   try {
//     const token = getToken();

//     const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${token}`, // Include token in Authorization header
//       'Content-Type': 'application/json',
//       },  
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         alert('Unauthorized access. Please log in again.');
//         // Redirect to login page or take appropriate action
//       }
//       throw new Error(`Error: ${response.status} - ${response.statusText}`);
//     }

//     fetchProjects(); // Refresh the table
//     const modal = bootstrap.Modal.getInstance(document.getElementById('editProjectModal'));
//     if (modal) modal.hide();
//   } catch (error) {
//     console.error('Error updating project:', error);
//     alert('Failed to update the project. Please try again.');
//   }
// }

async function editProject(event) {
  event.preventDefault(); // Prevent default form submission

  const projectId = document.getElementById('edit-project-id').value;
  const token = getToken();

  const data = {
    // Assuming your form has inputs with ids 'projectName' and 'projectDescription'
    name: document.getElementById('edit-project-name').value,
    description: document.getElementById('edit-project-description').value,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in Authorization header
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Include the data in the request body
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert('Unauthorized access. Please log in again.');
        // Redirect to login page or take appropriate action
      }
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    fetchProjects(); // Refresh the table
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProjectModal'));
    if (modal) modal.hide();
  } catch (error) {
    console.error('Error updating project:', error);
    alert('Failed to update the project. Please try again.');
  }
}

async function saveProjectChanges() {
  const projectId = document.getElementById('edit-project-id').value;
  const name = document.getElementById('edit-project-name').value.trim();
  const description = document.getElementById('edit-project-description').value.trim();

  if (!name || !description) {
    alert('Both project name and description are required.');
    return;
  }

  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'PUT',  // Use PUT for updating data
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }), // Send updated data
    });

    if (!response.ok) {
      if (response.status === 401) {
        alert('Unauthorized access. Please log in again.');
      }
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Refresh the project list
    fetchProjects();

    // Close the modal after update
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProjectModal'));
    if (modal) modal.hide();

    // Reset form
    document.getElementById('edit-project-form').reset();

  } catch (error) {
    console.error('Error updating project:', error);
    alert('Failed to update the project. Please try again.');
  }
}


async function loadProjectDetails(projectId) {
  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const project = await response.json();
    
    // Populate the edit form with project data
    document.getElementById('edit-project-id').value = project.id;
    document.getElementById('edit-project-name').value = project.name;
    document.getElementById('edit-project-description').value = project.description;

    // Open the modal
    const modal = new bootstrap.Modal(document.getElementById('editProjectModal'));
    modal.show();

  } catch (error) {
    console.error('Error loading project details:', error);
    alert('Failed to load project details.');
  }
}
// Initialize
document.getElementById('add-project-form').addEventListener('submit', addProject);
document.getElementById('edit-project-form').addEventListener('submit', editProject);
fetchProjects(); // Fetch projects directly on initialization