const token = localStorage.getItem("token");
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token");
    const socket = io('http://localhost:4000', {
        path: "/socket.io"
    });

    // Listen for follow events
    socket.on('followed', (data) => {
        alert(`${data.followerName} is now following you!`);
        console.log(`${data.followerName} is following user with ID ${data.followingId}`);
    });

    // Listen for unfollow events
    socket.on('unfollowed', (data) => {
        alert(`User with ID ${data.followerId} unfollowed user with ID ${data.followingId}`);
    });

    const userListContainer = document.getElementById('user-list');
    const followingList = document.querySelector('#following-list ul');
    const followersListContainer = document.querySelector('#followers-list ul');

    const getCurrentUserIdFromToken = (token) => {
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    };

    // Load users
    fetchUsers();
    fetchFollowers();
    fetchFollowing();

    async function fetchUsers() {
        /* try {
            const response = await axios.get('http://localhost:4000/get-Users', {
                headers: {
                    "Authorization": token
                }
            });
            const users = response.data.userList;
            userListContainer.innerHTML = '';

            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.classList.add('user');

                const userName = document.createElement('span');
                userName.textContent = user.name;

                const followButton = document.createElement('button');
                followButton.textContent = 'Follow';
                followButton.dataset.userId = user.id;

                userDiv.appendChild(userName);
                userDiv.appendChild(followButton);
                userListContainer.appendChild(userDiv);

                followButton.addEventListener('click', () => {
                    followUser(user.id, userName.textContent, followButton);
                });
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        } */
        try {
        const response = await axios.get('http://localhost:4000/get-Users', {
            headers: {
                "Authorization": token
            }
        });
        const users = response.data.userList;
        userListContainer.innerHTML = '';

        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.classList.add('user');

            const userName = document.createElement('span');
            userName.textContent = user.name;

            const followButton = document.createElement('button');
            followButton.textContent = 'Follow';
            followButton.dataset.userId = user.id;

            const seeRecipeButton = document.createElement('button');
            seeRecipeButton.textContent = 'See Recipes';
            seeRecipeButton.addEventListener('click', () => {
                viewUserContributions(user.id, user.name);
            });

            userDiv.appendChild(userName);
            userDiv.appendChild(followButton);
            userDiv.appendChild(seeRecipeButton);
            userListContainer.appendChild(userDiv);

            followButton.addEventListener('click', () => {
                followUser(user.id, userName.textContent, followButton);
            });
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
    }

    async function followUser(userId, userName, followButton) {
        try {
            const currentUserId = getCurrentUserIdFromToken(token);
            await axios.post(`http://localhost:4000/follow/${userId}`, { currentUserId }, {
                headers: { "Authorization": token }
            });

            followButton.textContent = 'Unfollow';
            followButton.removeEventListener('click', followUser);
            followButton.addEventListener('click', () => unfollowUser(userId, followButton));

            // Add to following list
            const li = document.createElement('li');
            li.textContent = userName;
            followingList.appendChild(li);

        } catch (error) {
            console.error('Error following user:', error);
        }
    }

    async function unfollowUser(userId, followButton) {
        try {
            const currentUserId = getCurrentUserIdFromToken(token);
            await axios.delete(`http://localhost:4000/unfollow/${userId}`, {
                headers: { "Authorization": token },
                data: { currentUserId }
            });

            followButton.textContent = 'Follow';
            followButton.removeEventListener('click', unfollowUser);
            followButton.addEventListener('click', () => followUser(userId, followButton));

            // Remove from following list
            const liToRemove = document.querySelector(`#following-list li[data-user-id="${userId}"]`);
            if (liToRemove) followingList.removeChild(liToRemove);

        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    }

    async function fetchFollowers() {
        try {
            const currentUserId = getCurrentUserIdFromToken(token);
            const response = await axios.get(`http://localhost:4000/get-all-followers/${currentUserId}`, {
                headers: { "Authorization": token }
            });

            followersListContainer.innerHTML = '';  // Clear list
            const followers = response.data.followerList;

            followers.forEach(follower => {
                const li = document.createElement('li');
                li.textContent = follower.name;

                // Add remove button
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.dataset.userId = follower.id;

                li.appendChild(removeButton);
                followersListContainer.appendChild(li);

                removeButton.addEventListener('click', () => removeFollower(follower.id, li));
            });

        } catch (error) {
            console.error('Error fetching followers:', error);
        }
    }
    async function removeFollower(userId, liElement) {
        try {
            const currentUserId = getCurrentUserIdFromToken(token);
            await axios.delete(`http://localhost:4000/unfollow/${userId}`, {
                headers: { "Authorization": token },
                data: { currentUserId }
            });
            followersListContainer.removeChild(liElement);
        } catch (error) {
            console.error('Error removing follower:', error);
        }
    }

    async function fetchFollowing() {
        try {
            const currentUserId = getCurrentUserIdFromToken(token);
            const response = await axios.get(`http://localhost:4000/get-all-following/${currentUserId}`, {
                headers: { "Authorization": token }
            });
    
            followingList.innerHTML = '';  // Clear list
            const following = response.data.followingList || [];
    
            following.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.name;

                // Add unfollow button
                const unfollowButton = document.createElement('button');
                unfollowButton.textContent = 'Unfollow';
                unfollowButton.dataset.userId = user.id;

                li.appendChild(unfollowButton);
                followingList.appendChild(li);

                unfollowButton.addEventListener('click', () => unfollowUser(user.id, li));
            });
    
        } catch (error) {
            console.error('Error fetching following list:', error);
        }
    }

    
    fetchFollowers();
    fetchFollowing();
    
});

function viewUserContributions(userId, userName) {
    // Navigate to a new page or dynamically load the contributions
    window.location.href = `http://127.0.0.1:5500/frontend/contributions.html?userId=${userId}&name=${encodeURIComponent(userName)}`;
}