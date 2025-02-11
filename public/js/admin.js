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
                          `<button class="btn btn-success btn-sm" onclick="makeAdmin(${user.Id})">Make Admin</button>` : 
                          `<button class="btn btn-warning btn-sm" onclick="removeAdmin(${user.Id})">Remove Admin</button>`
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

// Delete a user (Admins only)
// async function deleteUser(userId) {
//     try {
//         await fetch(`http://localhost:3000/users/${userId}`, {
//             method: 'DELETE',
//             headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//         });
//         loadUsers();
//     } catch (error) {
//         console.error('Error deleting user:', error);
//     }
// }

function deleteUser(userId) {
  fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
  .then(() => {
      alert("User deleted.");
      loadUsers();
  })
  .catch(error => console.error("Error deleting user:", error));
}

// Delete a project (Admins only)
async function deleteProject(projectId) {
    try {
        await fetch(`/api/admin/projects/${projectId}`, {
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
  



// fetchUsers();
// fetchProjects();