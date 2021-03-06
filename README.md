# React Dictionary management App

Built with React and deployed on Heroku, through Circle CI.

<img src="https://mildaintrainings.com/wp-content/uploads/2017/11/react-logo.png" height="100">
<img src="https://cdn.worldvectorlogo.com/logos/heroku-1.svg" height="100">
<img src="https://s3.amazonaws.com/awsmp-logos/000logo-circleci.svg" height="100">


 
## Build Setup

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### [Live Demo](https://dictionary-react.herokuapp.com/)

### Assignment
Before start, you have to install production dependencies with npm: `npm install`.

E-commerce companies like online stores and market places need datasets to be standardised, so that they correspond to ﬁlters and get properly picked up by the search engine. Each company has their own set of applicable values and requires product data to be in a certain language.

In order to transform the dataset into the desired format, a dictionary is needed.

Web Engineering Frontend Onsite Day Task Introduction

`The Domain of a dictionary represents the original value to transform, the Range of a dictionary represents the desired value. If we apply this dictionary to the Color column of the Original Dataset and replace the values by the corresponding Range value in the dictionary, we get the Desired Dataset.`

A dictionary is said to be consistent, if none of the following problems occur: 

`Duplicate Domains/Ranges: Two rows in the dictionary map to the same value, simply resulting in duplicate content.`

`Forks or Duplicate Domains with different Ranges: Two rows in the dictionary map to different values, resulting in an ambiguous transformation.`

`Cycles: Two or more rows in a dictionary result in cycles, resulting in a never-ending transformation.`

`Chains: A chain structure in the dictionary (a value in Range column also appears in Domain column of another entry), resulting in inconsistent transformation.`

When using dictionaries for data normalisation or other purposes, all these inconsistencies must not occur, otherwise the result of the transformation is ambiguous or not deﬁned.

### Requirements
With this introduction and slightly theoretical background in mind, you are now going to create a dictionary management application. 

The application must satisfy the following requirements: 
- Creating and deleting dictionaries 
- Showing available dictionaries in an overview 
- Editing dictionaries (adding, updating and removing rows) 
- Validating the entire dictionary regarding consistency (see above) 
- Validations should be shown as some kind of problem markers next to the offending part of the dictionary. 
- Problem markers have different severities, e.g. a Duplicate Domains/Ranges problem is less severe than a Cycle (in which case you cannot go on processing such a dictionary).

## License

This repo is available under the [MIT license](https://tldrlegal.com/license/mit-license).

## Contact

Copyright (C) 2016 Snake

[![@asherccohen](https://img.shields.io/badge/github-asherccohen-green.svg)](https://github.com/asherccohen) [![@asherccohen](https://img.shields.io/badge/twitter-iSnake_-blue.svg)](https://twitter.com/iSnake_)