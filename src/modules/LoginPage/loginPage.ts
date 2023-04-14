// loginPage.ts

// Get the DOM elements
export const imageSelection = document.getElementById("image-selection") as HTMLSelectElement | null;
export const loggedInUsersList = document.getElementById("logged-in-users") as HTMLUListElement | null;
export const createAccountButton = document.getElementById("create-account-button") as HTMLButtonElement | null;
export const submitButton = document.getElementById("submit-button") as HTMLButtonElement | null;
export const usernameInput = document.getElementById("username") as HTMLInputElement | null;
export const passwordInput = document.getElementById("password") as HTMLInputElement | null;
export const form = document.getElementById('form') as HTMLFormElement | null;
export const errorMessage = document.createElement("p");
export const userDeletedSuccessfully = document.createElement('h1');
export const failedToDeleteUser = document.createElement('h1');
export const messageInput = document.createElement('input');
export const listItem = document.createElement("li");
export const body = document.getElementById('body') as HTMLBodyElement;
export const accountCreated = document.createElement("h1");
export const logInpage = document.createElement('div');
let loggedInUser = null; // Declare loggedInUser variable

export const container = document.createElement('div');
container.style.display = "flex";
container.style.justifyContent = "center";

// Define the interfaces
export interface UserInfo {
    userName: any;
    password: string;
    status: string;
    imageurl: string;
    newUser: boolean;
}

export interface FirebaseResponse {
    [key: string]: UserInfo;
}

// Define the base URL
export const baseUrl = "https://social-media-68d76-default-rtdb.europe-west1.firebasedatabase.app/";

// Define the function to get the users
export async function getUsers(): Promise<UserInfo[]> {
    try {
        const response = await fetch(`${baseUrl}users.json`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const users: FirebaseResponse | null = await response.json();
        if (!users) {
            return [];
        }

        const usersArray: UserInfo[] = Object.values(users);
        return usersArray;
    } catch (err) {
        throw new Error("Failed to fetch users");
    }
}

// Update the users array - Define the function to save a user
export async function saveUser(user: UserInfo): Promise<void> {
    const arrData = await getUsers();
    const url = `${baseUrl}users/${user.userName}.json`;
    const init = {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    };

    try {
        const response = await fetch(url, init);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
    } catch (err) {
        console.log(err);
        throw new Error("Failed to save user information.");
    }
}

// Control already existing users
export async function isUsernameAvailable(username: string): Promise<boolean> {
    const users = await getUsers();
    // Checks if there's any user in the array with the same username using the some() method.
    return !users.some((user) => user.userName === username);
}

// Displaying already logged in users
export function displayLoggedInUsers(users: UserInfo[]): void {
    if (!loggedInUsersList) {
        console.error("Logged-in users list element not found.");
        return;
    }

    loggedInUsersList.innerHTML = "";

    for (const user of users) {
        if (!user.newUser) {
            const listItem = document.createElement("li");
            listItem.textContent = ${user.userName} - Status: ${user.status};

                    // Create an img element and set its src attribute to the user's image URL
        const userImage = document.createElement("img");
        userImage.src = user.imageurl;
        userImage.style.width = "50px";
        userImage.style.height = "50px";

        // Append the img element to the list item
        listItem.appendChild(userImage);
        loggedInUsersList.appendChild(listItem);

        // Event listener to the list item
        listItem.addEventListener("click", () => {
            document.body.innerHTML = "";
            form!.style.display = "none";
            const usersPage = document.createElement('div');
            usersPage.innerHTML = `<h1>Welcome to ${user.userName}'s page! </br> Status: ${user.status}</h1>`;
            document.body.appendChild(usersPage);

            // Create an img element and set its src attribute to the user's image URL
            const userImage = document.createElement("img");
            userImage.src = user.imageurl;
            userImage.style.width = "50px";
            userImage.style.height = "50px";
            userImage.style.alignItems = "center";
            usersPage.appendChild(userImage);

            // Log out button to log out user and take user back to login page with username input and password input but with the user still registered in the database
            const logOutButton = document.createElement('button');
            logOutButton.textContent = "Log Out";
            logOutButton.style.textAlign = "center";
            logOutButton.style.margin = "10px";

            document.body.appendChild(logOutButton);
            logOutButton.addEventListener("click", backToMainPage);
            function backToMainPage() {
                //takes away the logged in page and back to the login page
                messageInput.style.display = "none";
                logInpage.innerHTML = "";
                logOutButton!.style.display = "none";
                userDeletedSuccessfully.textContent = " "
                form!.style.display = "block";
                // usernameInput!.value ="";
                passwordInput!.value = "";
                errorMessage.textContent = " ";
                logInpage!.style.display = "none";
                loggedInUsersList!.style.display = "none";
                window.location.reload();}
            }
        )};
    }
}


