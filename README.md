react-webpack-setup 
Simple step by step walkthrough of setting up a React app with Webpack

Creating a React app with Webpack
Sometimes you want to get started with React but don't want all the bloat of create-react-app or some other boilerplate. Here's a step by step walkthrough of how to set to setup React with just Webpack!

What the project will look like when it's done
This guide will follow the conventions already established by create-react-app - e.g. build folder is called build, static assets are under public, etc.

At the end, this is the folder structure we'll have:

- public
   - index.html
- src
   - App.jsx
webpack.config.js
.babelrc
package.json
We'll go step by step and check that everything works after every stage:

Basic scaffolding: create project folder and serve plain HTML
Add Webpack and bundle a simple JS file
Add Babel for ES6 support
Add React
Without further ado, let's get started!

Step 1: Base scaffolding
First step is to create the project folder and add a plain HTML file.

To create the project and initialize the package.json, run these commands:

mkdir react-webpack
cd react-webpack
npm init -y
Then, add the main index html file - it usually sits in a public directory, so let's do that:

mkdir public
touch public/index.html
💡
Tip: You can open the project in VSCode by typing code . in the project folder and manually create the public folder from there
The index.html will just contain the base HTML5 boilerplate:

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React + Webpack</title>
</head>
<body>
    <h1>Hello React + Webpack!</h1>
</body>
</html>
💡
Tip: In VSCode, if you type `html:5` and hit tab, VSCode will create the `index.html` contents for you!
Now let's check it runs so far by just serving the HTML we just created with npm serve.

npx serve public
And it does! If you navigate to http://localhost:3000, you should see the hello message we just added:


💡
Tip: If npx serve public fails for you with Must use import to load ES Module error, check your Node version and make sure you're using at least Node 16 (latest LTS).
Step 2: Adding Webpack
For this section, it's best to just follow the latest official Webpack docs.

First, install Webpack:

npm install webpack webpack-cli --save-dev
Next, let's create a simple JavaScript file that we can configure Webpack to bundle:

mkdir src
touch src/index.js
We can just create a div with a hello message and add it to the document:

// index.js

const helloDiv = document.createElement("div");
helloDiv.innerHTML = "Hello from Javascript!";
document.body.append(helloDiv);
The, we need to configure Webpack by creating a webpack.config.js file in the root of the project:

// webpack.config.js

const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
};
Finally, in package.json, add a new "build" script:

// ...
"scripts": {
    "build": "webpack"
},
Now, let's try it out! After running npm run build, you should see a new folder was created, called build, with a main.js file in it! 💪

💡
Tip: Add the build folder to .gitignore to not commit it by accident. And if you haven't already, make sure to also ignore the node_modules folder.
Next, we need to move the static assets to the bundle.

More specifically, we want to also include the index.html file in the build folder.

Easiest way to do this is with the HtmlWebpackPlugin.

npm install html-webpack-plugin --save-dev
And update the webpack.config.jsfile:

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
  ],
};
This will copy the file under public/index.html, copy it to the build folder and inject a link to the bundled JS file (main.js).

Let's try it out!

npm run build
npx serve build
And it works! You should now also see the message "Hello from Javascript" :D


Adding Webpack dev server
So far, it was ok to just use npx serve to check our app works, but in real life, it's easier to just use the webpack-dev-server, so let's add that as well.

npm install --save-dev webpack-dev-server
Then, configure it in the Webpack config:

{
  // ...,
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    port: 3000,
  }
}
... and then add npm run start script to package json; and while we're there, pass in the right "mode":

{
  // ...,
  "scripts": {
    "build": "webpack --mode production",
    "start": "webpack serve --mode development"
  }
}
Finally, check that it works: run npm run start,  open http://localhost:3000 and check the app still works as before.

Step 3: Adding Babel
This is useful for allowing us to use all ES6 features and having them transpiled down to JS versions that all browsers can understand. (If you want to learn more about what Babel preset-env is and why it's useful, this article by Jacob Lind is a great overview).

First, let's install the required packages:

npm i @babel/core @babel/preset-env babel-loader --save-dev
Next, update the Webpack config to tell it to pass the files through Babel when bundling:

{
 // ...,
 module: {
    // exclude node_modules
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  // pass all js files through Babel
  resolve: {
    extensions: ["*", ".js"],
  }
}
Then, create the Babel config file - .babelrc. This is where we configure Babel to apply the preset-env transform.

// .babelrc

{
  "presets": [
    "@babel/preset-env"
  ]
}
Optionally, update the index.js to contain some ES6 features that wouldn't work without Babel 😀 (actually they do work in most browsers, but for example IE still doesn't support Array.fill).

// Use a feature that needs Babel to work in all browsers :)
// arrow functions + Array fill

const sayHelloManyTimes = (times) =>
  new Array(times).fill(1).map((_, i) => `Hello ${i + 1}`);

const helloDiv = document.createElement("div");
helloDiv.innerHTML = sayHelloManyTimes(10).join("<br/>");
document.body.append(helloDiv);
Finally, let's check everything works - run npm run start and check the app correctly runs:


Step 4: Add React
Finally, we can add React 😅

First, install it:

npm i react react-dom --save
npm i @babel/preset-react --save-dev
Then, update the .babelrc file to also apply the preset-react transform. This is needed, among other things, to support JSX.

// .babelrc

{
    "presets": [
      "@babel/preset-env",
      ["@babel/preset-react", {
      "runtime": "automatic"
    }]
    ]
}
💡
Tip: Specifying the preset-react runtime as automatic enables a feature that no longer requires importing React on top of every file.
Also, we need to update the Webpack config to pass jsx files through Babel as well:

// webpack.config.js

{
  // ...,
  module: {
    // exclude node_modules
    rules: [
      {
        test: /\.(js|jsx)$/,         // <-- added `|jsx` here
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  // pass all js files through Babel
  resolve: {
    extensions: ["*", ".js", ".jsx"],    // <-- added `.jsx` here
  },
}
Next, let's create a React component, so we can check that everything works:

// src/App.jsx

const App = () => <h1>Hello from React!</h1>;

export default Hello;
And add it to the main app file:

// index.js

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
💡
Note we're using the new React 18 syntax with createRoot.
Finally, we also update the index.html to provide a "root" node for the app:

<!-- index.html -->
<!-- ... -->
<body>
    <div id="root"></div>
</body>
Let's check that it works - run npm run start and you should see "Hello from React!":


Also, check there are no errors in the console.

You can also check that the app correctly runs in production, by running npm run build and then npx serve build.