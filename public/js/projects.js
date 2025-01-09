// Fetch and display all projects
async function fetchProjects() {
    try {
      const response = await fetch('http://localhost:3000/projects'); // GET /api/projects
      const projects = await response.json();
  
      const tableBody = document.getElementById('project-table-body');
      tableBody.innerHTML = ''; // Clear existing rows
  
      projects.forEach(project => {
        const row = `
          <tr>
            <td>${project.Id}</td>
            <td>${project.Name}</td>
            <td>${project.description}</td>

            <td>
              <button class="btn btn-warning btn-sm" onclick="editProject(${project.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">Delete</button>
            </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }
  
  // Delete a project
  async function deleteProject(projectId) {
    try {
      await fetch(`/api/projects/${projectId}`, { method: 'DELETE' }); // DELETE /api/projects/:id
      fetchProjects(); // Refresh the table
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }
  
  // Add a new project
async function addProject(event) {
  event.preventDefault(); // Prevent form submission from refreshing the page

  // Get project details from the form
  const name = document.getElementById('project-name').value;
  const description = document.getElementById('project-description').value;

  try {
    const response = await fetch('http://localhost:3000/projects', {
      method: 'POST', // POST /api/projects
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      fetchProjects(); // Refresh the table to show the new project
      const modal = bootstrap.Modal.getInstance(document.getElementById('addProjectModal'));
      modal.hide(); // Close the modal
      document.getElementById('add-project-form').reset(); // Reset the form
    } else {
      console.error('Failed to add project:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding project:', error);
  }
}

// Initialize
document.getElementById('add-project-form').addEventListener('submit', addProject); // Handle form submission

fetchProjects();
