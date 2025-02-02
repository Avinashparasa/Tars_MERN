import React, { useState, useEffect } from 'react';
import './AboutUS.css'; // Import the CSS file

function AboutUS() {
  document.title = "MyNottebok - About Us";
  const [userData, setUserData] = useState(null);
  const [pinnedRepos, setPinnedRepos] = useState([]);
  const username = process.env.REACT_APP_USER_NAME; 
  const token = process.env.REACT_APP_GITHUB_TOKEN ; // Replace with your GitHub token

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUserData(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [username]);

  useEffect(() => {
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
        {
          user(login: "${username}") {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  name
                  description
                  stargazerCount
                  forkCount
                  url
                  primaryLanguage {
                    name
                    color
                  }
                }
              }
            }
          }
        }
        `
      })
    })
      .then(response => response.json())
      .then(data => {
        setPinnedRepos(data.data.user.pinnedItems.nodes);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [username, token]);

  if (!userData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="about-container">
      <h1>About US</h1>
      <div className="profile-header">
        <div className="profile-picture-container">
          <img src={userData.avatar_url} alt="Profile" className="profile-picture" />
          <a 
            href={`https://github.com/${username}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="follow-button"
          >
            Follow
          </a>
        </div>
        <div className="profile-info">
          <h2>{userData.name} ({userData.login})</h2>
          <p>Github ID: {userData.id}</p>
          <p>{userData.bio}</p>
          <div className="profile-stats">
            <p><span>{userData.followers}</span> followers</p>
            <p><span>{userData.following}</span> following</p>
            <p><span>{userData.public_repos}</span> repositories</p>
          </div>
          <p>Location: {userData.location}</p>
          <p>Website: <a href={userData.blog}>Explore My Tech Portfolio</a></p>
        </div>
      </div>
      <div className="pinned-repos">
        <h3>Pinned Repositories</h3>
        <div className="repo-grid">
          {pinnedRepos.map(repo => (
            <div className="repo-card" key={repo.name}>
              <h4><a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name}</a></h4>
              <p>{repo.description}</p>
              <div className="repo-stats">
                <span style={{ color: repo.primaryLanguage.color }}>&#9679; {repo.primaryLanguage.name}</span>
                <span>&#9733; {repo.stargazerCount}</span>
                <span>&#8901; {repo.forkCount} Forks</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutUS;
