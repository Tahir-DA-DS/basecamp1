// Fetch and display all users
async function fetchUsers() {
    try {
      const response = await fetch('http://localhost:3000/users'); // GET /api/users
      const users = await response.json();
  
      const tableBody = document.getElementById('user-table-body');
      tableBody.innerHTML = ''; // Clear existing rows
  
      users.forEach(user => {
        const row = `
          <tr>
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
            </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  
  // Delete a user
  async function deleteUser(userId) {
    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' }); // DELETE /api/users/:id
      fetchUsers(); // Refresh the table
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
  
  // Initialize
  fetchUsers();