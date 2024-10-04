/* const token = localStorage.getItem("token");
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token");

    const userListContainer = document.getElementById('user-list');
    const loadUsersButton = document.createElement('button');
    loadUsersButton.textContent = "Load Users";
    document.body.insertBefore(loadUsersButton, userListContainer);

    loadUsersButton.addEventListener('click', fetchUsers);

    async function fetchUsers() {
        try {
            const response = await axios.get('http://localhost:4000/get-Users', {
                headers: {
                    "Authorization": token
                }
            });
            const users = response.data.userList;

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
                    followUser(user.id, userName, followButton);
                });
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    async function followUser(userId, userNameElement, followButton) {
        try {
            const currentUserId = getCurrentUserIdFromToken(token); // Create a function to extract user ID from the token


            const response = await axios.post(`http://localhost:4000/follow/${userId}`, {currentUserId}, {
                headers: {
                    "Authorization": token
                }
            });
            console.log('Follow response:', response.data);

            // Update the button to show 'Unfollow'
            followButton.textContent = 'Unfollow';
            followButton.removeEventListener('click', followUser); // Remove old event listener

            followButton.addEventListener('click', () => {
                unfollowUser(userId, userNameElement, followButton);
            });

            // Optionally, you can also update the followers list in the UI
            updateFollowersList(userNameElement.textContent);
        } catch (error) {
            console.error('Error following user:', error);
        }
    }

    async function unfollowUser(userId, userNameElement, followButton) {
        try {
            const response = await axios.delete(`http://localhost:4000/unfollow/${userId}`, {
                headers: {
                    "Authorization": token
                }
            });

            // Update the button to show 'Follow'
            followButton.textContent = 'Follow';
            followButton.removeEventListener('click', unfollowUser); // Remove old event listener

            followButton.addEventListener('click', () => {
                followUser(userId, userNameElement, followButton);
            });

            // Optionally, update the followers list in the UI
            removeFromFollowersList(userNameElement.textContent);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    }

    function updateFollowersList(userName) {
        const followersList = document.getElementById('followers-list'); // Assuming you have a container for the followers list
        const newFollower = document.createElement('div');
        newFollower.textContent = userName;
        followersList.appendChild(newFollower);
    }

    function removeFromFollowersList(userName) {
        const followersList = document.getElementById('followers-list'); 
        const followers = followersList.querySelectorAll('div');

        followers.forEach(follower => {
            if (follower.textContent === userName) {
                followersList.removeChild(follower);
            }
        });
    }
});

// Function to extract user ID from the token
const getCurrentUserIdFromToken = (token) => {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token to get payload
    return payload.userId; // Assuming your token payload has a field named 'id'
};
 */

const token = localStorage.getItem("token");


document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:4000', {
        path: "/socket.io"
    });
    // Listen for follow events (outside of followUser)
    socket.on('followed', (data) => {
        alert(`${data.followerName} is now following you!`);
        console.log(`${data.followerName}`)
        // Optionally, update the UI to reflect the new follower
    });

    // Listen for unfollow events (outside of unfollowUser)
    socket.on('unfollowed', (data) => {
        alert(`You have unfollowed a user!`);
        // Optionally, update the UI to reflect the unfollowing
    });
    const userListContainer = document.getElementById('user-list');
    const loadUsersButton = document.createElement('button');
    loadUsersButton.textContent = "Load Users";
    document.body.insertBefore(loadUsersButton, userListContainer);

    loadUsersButton.addEventListener('click', fetchUsers);

    async function fetchUsers() {
        try {
            const response = await axios.get('http://localhost:4000/get-Users', {
                headers: {
                    "Authorization": token
                }
            });
            const users = response.data.userList;

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
                    followUser(user.id, userName, followButton);
                });
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    

    async function followUser(userId, userNameElement, followButton) {
        try {
            const currentUserId = getCurrentUserIdFromToken(token); // Extract user ID from the token

            const response = await axios.post(`http://localhost:4000/follow/${userId}`, { currentUserId }, {
                headers: {
                    "Authorization": token
                }
            });
            console.log('Follow response:', response.data);

            // Update the button to show 'Unfollow'
            followButton.textContent = 'Unfollow';
            followButton.removeEventListener('click', followUser); // Remove old event listener

            followButton.addEventListener('click', () => {
                unfollowUser(userId, userNameElement, followButton);
            });

            // Update the followers and following lists
            updateFollowersList(userNameElement.textContent);
            updateFollowingList(userNameElement.textContent);
            
        } catch (error) {
            console.error('Error following user:', error);
        }
    }

    async function unfollowUser(userId, userNameElement, followButton) {
        try {
            const response = await axios.delete(`http://localhost:4000/unfollow/${userId}`, {
                headers: {
                    "Authorization": token
                }
            });

            // Update the button to show 'Follow'
            followButton.textContent = 'Follow';
            followButton.removeEventListener('click', unfollowUser); // Remove old event listener

            followButton.addEventListener('click', () => {
                followUser(userId, userNameElement, followButton);
            });

            // Update the followers and following lists
            removeFromFollowersList(userNameElement.textContent);
            removeFromFollowingList(userNameElement.textContent);
      
            
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    }

    function updateFollowersList(userName) {
        const followersList = document.getElementById('followers-list');
        const newFollower = document.createElement('div');
        newFollower.textContent = userName;
        followersList.appendChild(newFollower);
    }

    function updateFollowingList(userName) {
        const followingList = document.getElementById('following-list');
        const newFollowing = document.createElement('div');
        newFollowing.textContent = userName;
        followingList.appendChild(newFollowing);
    }

    function removeFromFollowersList(userName) {
        const followersList = document.getElementById('followers-list'); 
        const followers = followersList.querySelectorAll('div');

        followers.forEach(follower => {
            if (follower.textContent === userName) {
                followersList.removeChild(follower);
            }
        });
    }

    function removeFromFollowingList(userName) {
        const followingList = document.getElementById('following-list'); 
        const followings = followingList.querySelectorAll('div');

        followings.forEach(following => {
            if (following.textContent === userName) {
                followingList.removeChild(following);
            }
        });
    }
});

// Function to extract user ID from the token
const getCurrentUserIdFromToken = (token) => {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token to get payload
    return payload.userId; // Assuming your token payload has a field named 'id'
};
