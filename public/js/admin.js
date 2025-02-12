// Fetch all users (Admins only)

document.addEventListener("DOMContentLoaded", function () {
  const authToken = localStorage.getItem("token"); // Assuming user token is stored
  if (!authToken) {
      alert("Unauthorized access. Please log in.");
      window.location.href = "index.html";
      return;
  }

  fetch("http://localhost:3000/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
  })
  .then(response => response.json())  
  .then(user => {
      if (!user.isAdmin) {
          alert("Access Denied. Admins only.");
          window.location.href = "index.html";
      } else {
          loadUsers();
          loadProjects();
      }
  })
  .catch((error) => {
      alert(error)
      alert("Session expired. Please log in again.");
      window.location.href = "index.html";
  });
});


function loadUsers() {
  fetch("http://localhost:3000/users", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(response => response.json())
      .then(users => {
          const userTableBody = document.getElementById("user-table-body");
          userTableBody.innerHTML = "";

          users.forEach(user => {
              const row = document.createElement("tr");

              row.innerHTML = `
                  <td>${user.Id}</td>
                  <td>${user.Email}</td>
                  <td>${user.IsAdmin ? "Admin" : "User"}</td>
                  <td>
                      ${!user.IsAdmin ? 
                          `<button class="btn btn-success btn-sm" onclick="promoteToAdmin(${user.Id})">Make Admin</button>` : 
                          `<button class="btn btn-warning btn-sm" onclick="demoteAdmin(${user.Id})">Remove Admin</button>`
                      }
                      <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.Id})">Delete</button>
                  </td>
              `;

              userTableBody.appendChild(row);
          });
      })
      .catch(error => console.error("Error loading users:", error));
}

// Fetch all projects (Admins only)
async function loadProjects() {
    try {
        const response = await fetch('http://localhost:3000/projects/all', {
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


function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return; // Confirmation prompt

  fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
      headers: { 
          "Content-Type": "application/json", // Ensure JSON request format
          Authorization: `Bearer ${localStorage.getItem("token")}` 
      },
  })
  .then(response => {
      if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message || "Failed to delete user"); });
      }
      return response.json();
  })
  .then(data => {
      alert(data.message || "User deleted successfully.");
      loadUsers(); // Refresh user list
  })
  .catch(error => {
      console.error("Error deleting user:", error.message);
      alert(`Error: ${error.message}`);
  });
}
// Delete a project (Admins only)
async function deleteProject(projectId) {
    try {
        await fetch(`http://localhost:3000/projects/${projectId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        loadProjects();
    } catch (error) {
        console.error('Error deleting project:', error);
    }
}

async function promoteToAdmin(userId) {
    if (!confirm('Are you sure you want to make this user an admin?')) return;
  
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}/setAdmin`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if needed
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        alert('User successfully promoted to admin.');
        loadUsers(); // Refresh the users list
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
        const response = await fetch(`http://localhost:3000/users/${userId}/removeAdmin`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if needed
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: 'user' }) // Send role as 'user' to demote
        });

        const data = await response.json();

        if (!response.ok) {
            alert(`Failed to remove admin: ${data.message}`);
            return;
        }

        alert(`User ${userId} successfully demoted.`);
        loadUsers(); // Refresh the users list
    } catch (error) {
        console.error('Error removing admin:', error);
        alert('An error occurred while demoting the user.');
    }
}





// fetchUsers();
// fetchProjects();