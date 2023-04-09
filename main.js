/** @format */

const accessToken = "pe1RLGng56CQy3mXgJH8MiVOEN79lUS5DKEus1-8DbE";
let mastodonInstanceURL = "";

async function fetchAPI(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}

async function getNonFollowers(userId, mastodonInstanceURL) {
  const followingURL = `${mastodonInstanceURL}/api/v1/accounts/${userId}/following`;
  const followersURL = `${mastodonInstanceURL}/api/v1/accounts/${userId}/followers`;

  const following = await fetchAPI(followingURL);
  const followers = await fetchAPI(followersURL);

  const nonFollowers = following.filter(
    (user) => !followers.some((follower) => follower.id === user.id)
  );

  displayNonFollowers(nonFollowers, mastodonInstanceURL);
}

function displayNonFollowers(nonFollowers, mastodonInstanceURL) {
  const list = document.getElementById("non-followers-list");
  list.innerHTML = '';

  nonFollowers.forEach(user => {
    const listItem = document.createElement("li");
    listItem.id = "non-followers-list--item";

    const displayName = document.createElement("h3");
    displayName.id = "non-followers-list--display-name";

    const bio = document.createElement("p");
    bio.id = "non-followers-list--bio";

    const link = document.createElement("a");
    link.id = "non-followers-list--user-link";

    const avatar = document.createElement("img");
    avatar.id = "non-followers-list--user-avatar";

    const remoteUsername = user.acct;
    const remoteAvatar = user.avatar_static;
    const remoteDisplayName = user.display_name;
    const remoteBio = user.note;
    
    link.href = `${mastodonInstanceURL}/@${remoteUsername}`;
    link.textContent = `@${remoteUsername}`;
    avatar.src = `${remoteAvatar}`;
    displayName.textContent = `${remoteDisplayName}`;
    bio.innerHTML = `${remoteBio}`;

    // listItem.textContent = `${user.display_name}`;
    listItem.appendChild(avatar);
    listItem.appendChild(displayName);
    listItem.appendChild(link);
    listItem.appendChild(bio);

    list.appendChild(listItem);
  });
}


function onSubmit(event) {
  event.preventDefault();
  const userId = document.getElementById("user-id-input").value;
  const instanceInput = document.getElementById("instance-input").value.trim();
  const mastodonInstanceURL = instanceInput.startsWith("http") ? instanceInput : `https://${instanceInput.replace(/^@/, "")}`;
  getNonFollowers(userId, mastodonInstanceURL);
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("user-id-form");
  form.addEventListener("submit", onSubmit);
});
