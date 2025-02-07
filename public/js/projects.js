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

    const projects = await response.json();
    console.log('Fetched Projects:', projects);

    const tableBody = document.getElementById('project-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    if (projects.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4">No projects found.</td></tr>';
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
            <button class="btn btn-warning btn-sm" onclick="editProject(${project.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">Delete</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    const tableBody = document.getElementById('project-table-body');
    tableBody.innerHTML =
      '<tr><td colspan="4">Failed to load projects. Please try again later.</td></tr>';
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
async function editProject(projectId) {

  try {
    const token = getToken();

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'UPDATE',
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
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProjectModal'));
    if (modal) modal.hide();
  } catch (error) {
    console.error('Error updating project:', error);
    alert('Failed to update the project. Please try again.');
  }
}

// Initialize
document.getElementById('add-project-form').addEventListener('submit', addProject);
document.getElementById('edit-project-form').addEventListener('submit', editProject)
fetchProjects(); // Fetch projects directly on initialization