// Fetch all users (Admins only)
async function fetchUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const users = await response.json();
        const userTable = document.getElementById('user-table-body');
        userTable.innerHTML = '';

        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.email}</td>
                    <td>${user.IsAdmin ? 'Admin' : 'User'}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `;
            userTable.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Fetch all projects (Admins only)
async function fetchProjects() {
    try {
        const response = await fetch('/api/admin/projects', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const projects = await response.json();
        const projectTable = document.getElementById('project-table-body');
        projectTable.innerHTML = '';

        projects.forEach(project => {
            const row = `
                <tr>
                    <td>${project.id}</td>
                    <td>${project.name}</td>
                    <td>${project.description}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editProject(${project.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">Delete</button>
                    </td>
                </tr>
            `;
            projectTable.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Delete a user (Admins only)
async function deleteUser(userId) {
    try {
        await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// Delete a project (Admins only)
async function deleteProject(projectId) {
    try {
        await fetch(`/api/admin/projects/${projectId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchProjects();
    } catch (error) {
        console.error('Error deleting project:', error);
    }
}
async function promoteToAdmin(userId) {
    if (!confirm('Are you sure you want to make this user an admin?')) return;
  
    try {
      const response = await fetch(`/api/admin/users/${userId}/promote`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if needed
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        alert('User successfully promoted to admin.');
        fetchUsers(); // Refresh the users list
      } else {
        const errorMsg = await response.json();
        alert(`Failed to promote user: ${errorMsg.message}`);
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('An error occurred while promoting the user.');
    }
  }

  async function demoteAdmin(userId) {
    if (!confirm('Are you sure you want to remove this user as an admin?')) return;
  
    try {
      const response = await fetch(`/api/admin/users/${userId}/demote`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if needed
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        alert('User successfully removed as an admin.');
        fetchUsers(); // Refresh the users list
      } else {
        const errorMsg = await response.json();
        alert(`Failed to remove admin: ${errorMsg.message}`);
      }
    } catch (error) {
      console.error('Error removing admin:', error);
      alert('An error occurred while removing the user as admin.');
    }
  }
  
// Run functions on page load
fetchUsers();
fetchProjects();