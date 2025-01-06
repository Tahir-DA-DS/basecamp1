// Fetch and display all projects
async function fetchProjects() {
    try {
      const response = await fetch('/api/projects'); // GET /api/projects
      const projects = await response.json();
  
      const tableBody = document.getElementById('project-table-body');
      tableBody.innerHTML = ''; // Clear existing rows
  
      projects.forEach(project => {
        const row = `
          <tr>
            <td>${project.id}</td>
            <td>${project.name}</td>
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
  
  // Initialize
  fetchProjects();