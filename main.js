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
    const remoteUsername = user.acct;
    const profileLink = `${mastodonInstanceURL}/@${remoteUsername}`;
    const remoteAvatar = user.avatar_static;
    const remoteDisplayName = user.display_name;
    const remoteBio = user.note;

    const listItem = document.createElement("li");
    listItem.id = "non-followers-list--item";

    const displayName = document.createElement("h3");
    displayName.id = "non-followers-list--display-name";
    displayName.textContent = `${remoteDisplayName}`;

    const bio = document.createElement("p");
    bio.id = "non-followers-list--bio";
    bio.innerHTML = `${remoteBio}`;

    const link = document.createElement("a");
    link.id = "non-followers-list--user-link";
    link.href = `${profileLink}`;
    link.textContent = `@${remoteUsername}`;

    const avatar = document.createElement("img");
    avatar.id = "non-followers-list--user-avatar";
    avatar.src = `${remoteAvatar}`;

    const avatarLink = document.createElement("a");
    avatarLink.href = profileLink;
    avatarLink.appendChild(avatar);

    listItem.appendChild(avatarLink);
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
