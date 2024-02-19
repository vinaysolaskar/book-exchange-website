        function toggle() {
            var blur = document.getElementById('blur');
            blur.classList.toggle('active')

            var popup = document.getElementById('popup');
            popup.classList.toggle('active')
        }


        // document.getElementById('edit-btn').addEventListener('click', function () {
        //     document.getElementById('edit-form').hidden = false;
        //     document.getElementById('username').hidden = true;
        //     document.getElementById('email').hidden = true;
        //     document.getElementById('number').hidden = true;
        // });

        // document.getElementById('edit-form').addEventListener('submit', function (event) {
        //     event.preventDefault();

            // You can save the edited data here to a database or anywhere else
        //     console.log('Saving edited data...');

        //     document.getElementById('username').textContent = document.getElementById('username-input').value;
        //     document.getElementById('email').textContent = document.getElementById('email-input').value;
        //     document.getElementById('number').textContent = document.getElementById('number-input').value;

        //     // Update profile picture
        //     let profilePic = document.getElementById('profile-pic-input').files[0];
        //     let profilePicURL = URL.createObjectURL(profilePic);
        //     document.getElementById('profile-pic').src = profilePicURL;

        //     // Hide form and display updated data
        //     document.getElementById('edit-form').hidden = true;
        //     document.getElementById('username').hidden = false;
        //     document.getElementById('email').hidden = false;
        //     document.getElementById('number').hidden = false;
        // });