import React from 'react';

const About = () => {
    document.title = "MyNottebok - About Us"; 

    return (
        <div className="container my-5">
            <h1 align="center">About Our App</h1>
            <p>This app is a simple notebook application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to create, edit, and manage their notes efficiently.</p>

            <h2>Features</h2>
            <ul>
                <li><strong>User Authentication:</strong> Secure authentication system to protect user data.</li>
                <li><strong>Notebook Management:</strong> Create, edit, and delete notes with ease.</li>
                <li><strong>Rich Text Editor:</strong> Utilize a WYSIWYG editor to format your notes.</li>
                <li><strong>Real-time Updates:</strong> See changes instantly with real-time data synchronization.</li>
                <li><strong>Responsive Design:</strong> Enjoy a seamless experience on desktop, tablet, and mobile devices.</li>
                <li><strong>Account Management:</strong> Manage your account settings with ease.</li>
                <li><strong>Password Update:</strong> Update your password with ease.</li>
                <li><strong>Account Deletion:</strong> Delete your account with ease.</li>
                <li><strong>Delete All Notes:</strong> Delete all your notes with ease.</li>
            </ul>

            <h2>How to Use</h2>
            <p>To get started, log in to your account or sign up if you're a new user. Once logged in, you can start creating and managing your notes. Use the navigation menu to access different sections of the application such as creating new notes, viewing/editing existing notes, and managing your account settings.</p>

            <h2>Feedback</h2>
            <p>If you have any feedback or suggestions for improving this app, please feel free to contact us.</p>
        </div>
    );
};

export default About;
