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
              <button class="btn btn-warning btn-sm" onclick="editProject(${project.Id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.Id})">Delete</button>
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
      await fetch(`http://localhost:3000/projects/${projectId}`, { method: 'DELETE' }); // DELETE /api/projects/:id
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

async function editProject(projectId) {
  try {
    // Fetch the current project details
    const response = await fetch(`http://localhost:3000/projects/${projectId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch project details: ${response.statusText}`);
    }

    const project = await response.json();

    // Pre-fill the modal form with the current project details
    document.getElementById('edit-project-id').value = project.Id; // Hidden input for ID
    document.getElementById('edit-project-name').value = project.Name;
    document.getElementById('edit-project-description').value = project.description;

    // Show the modal
    const editProjectModal = new bootstrap.Modal(document.getElementById('editProjectModal'));
    editProjectModal.show();
  } catch (error) {
    console.error('Error fetching project details:', error);
    alert('Failed to load project details. Please try again.');
  }
}
async function saveProjectChanges() {
  try {
    const projectId = document.getElementById('edit-project-id').value;
    const projectName = document.getElementById('edit-project-name').value.trim();
    const projectDescription = document.getElementById('edit-project-description').value.trim();

    // Validate input
    if (!projectName || !projectDescription) {
      alert('Both project name and description are required.');
      return;
    }

    // Confirm before saving changes
    if (!confirm('Are you sure you want to save these changes?')) {
      return;
    }

    // Send a PUT request to update the project
    const response = await fetch(`http://localhost:3000/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectName,
        description: projectDescription,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update project: ${response.statusText}`);
    }

    // Close the modal and refresh the project list
    const editProjectModal = bootstrap.Modal.getInstance(document.getElementById('editProjectModal'));
    editProjectModal.hide();
    fetchProjects(); // Reload the project list
  } catch (error) {
    console.error('Error updating project:', error);
    alert('Failed to update the project. Please try again.');
  }
}

// Initialize
document.getElementById('add-project-form').addEventListener('submit', addProject); // Handle form submission

fetchProjects();
