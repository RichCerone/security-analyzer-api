# Getting Started
To use this project, you must generated a PAT (personal access token) on Github. The PAT will allow you to make up to 5,000 requests per hour through the rate limiting placed on the public API.

You will also need an npm version >= 9.2.0 and node version >= 18.17.1

## How to Generate a PAT
1. Go to [GitHub](https://github.com/).
2. Click on your profile in the upper right hand corner.
3. In the menu bar, click on **Settings**.
4. On the left hand side, at the very bottom of the menu, click on **Developer settings**.
5. Expand **Personal access tokens**.
6. Click on **Tokens (classic)**.
7. Cick on **Generate new token** and then in the drop down, click **Generate new token (classic)**.
8. Add a note if you want, for the token, and then set the expiration date to whatever you please. **You do not need to select any scopes**.
9. Scroll to the very bottom, and click **Generate token**.
10. Make sure to copy and save the token value.

# How to Use the API.
The API is ready to use, the only thing needed is to insert the token value you generated for your PAT.

1. Open **app.js**.
2. Where you see **MyOcktokit** being instantiated, there is a parameter field called **auth**. Paste the string value of your PAT there.
3. Finally, start the API with node .\app.js 
