// 쿠키 가져오기
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// 프로필 삭제
async function deleteProfile() {
    try {
        const response = await fetch(`http://localhost:3000/api/users`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie('token')}`,
            },
        });

        if (response.ok) {
            const result = await response.json();
            // 삭제 후 페이지 갱신
            location.reload();
        } else if (response.status === 403) {
            // 권한이 없는 경우 알림 표시
            alert('삭제할 권한이 없습니다.');
        } else {
            console.error('Error deleting profile:', response.status, response.statusText);
            const errorData = await response.json(); // Log additional error details
            console.error('Additional error details:', errorData);
        }
    } catch (error) {
        console.error('Error deleting profile:', error.message);
    }
}

// 프로필 가져오기
async function getUserDetails() {
    try {
        const token = getCookie('token');

        if (token) {
            const response = await fetch(`http://localhost:3000/api/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                const userData = result.data; 

                // Update HTML with user details
                document.getElementById('userName').innerText = `이름: ${userData.name}`;
                document.getElementById('userEmail').innerText = `Email: ${userData.email}`;
            } else if (response.status === 403) {
                alert('조회할 권한이 없습니다.');
            } else {
                console.error('Error fetching user profile:', response.status, response.statusText);
            }
        } else {
            alert('로그인이 필요합니다.');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', getUserDetails);
