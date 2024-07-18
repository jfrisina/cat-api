//------------------------- BEGIN INDEX.JS ------------------------- 

// imports
import Carousel from "./Carousel";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

// load environment variables from .env into process.env
dotenv.config();

//------------------------- TARGET ELEMENTS IN DOM------------------------- 
// target the id of the input element 
const breedSelect = document.getElementById("breedSelect");

// target the information section
const infoDump = document.getElementById("infoDump");

// target the progress bar div element
const progressBar = document.getElementById("progressBar");

// target the get favourites button+
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

//------------------------- API AND HEADER INFO ------------------------- 
// set up API key, which is referencing a hidden file for security reasons
const API_KEY = process.env.API_KEY;

// base URL of the API
const baseURL = '/api';

// set up the http header, which is a key-value pair that provides additional information about the request or the response. Used to transmit various types of metadata between the client and the server.
const header = {
  'x-api-key': API_KEY
};

//-------------------- GET LIST OF BREEDS INTO INPUT-----------------------
/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
async function initialLoad() {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/breeds');
    console.log(response)
        // error troubleshooting
    if (!response.ok) {
      throw new Error(`initial load fetch not working: ${response.status} ${response.statusText}`);
    }
    const breedData = await response.json();
    breedData.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error: ', error);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  initialLoad();
})

//--------------------- GET INFO ABOUT SPECIFIC BREED ----------------------- 
/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

async function handleBreedSelection() {
  try {
    const breedId = breedSelect.value;

    // // clear existing carousel items
    if (Carousel && typeof Carousel.clear === 'function') {
       Carousel.clear();
    }

    // fetch images based on breed ID
    const response = await fetch(`${baseURL}/v1/images/search?breed_id=${breedId}&limit=10`, { headers: header });
    
    console.log(response)
    
    // error troubleshooting
    if (!response.ok) {
      throw new Error(`breed ID fetch not working: ${response.status} ${response.statusText}`);
    }

    // parse json response
    const imageData = await response.json();

    // update carousel with new images
    imageData.forEach(image => {
      const carouselItem = Carousel.createCarouselItem(image.url, image.breed, image.id);
      Carousel.appendCarousel(carouselItem);
    });

    // update infoDump with breed information
    const breedInfoResponse = await fetch(`${baseURL}/v1/breeds/${breedId}`, { headers: header});

    console.log(breedInfoResponse)
    
    // error troubleshooting
    if (!breedInfoResponse.ok) {
      throw new Error(`breed info response fetch not working: ${response.status} ${response.statusText}`);
    }
    const breedData = await breedInfoResponse.json();

    // Create HTML structure for breed infomation
    infoDump.innerHTML = `
      <h2>${breedData.name}</h2>
      <p>${breedData.description}</p>
      <p>Temperament: ${breedData.temperament}</p>
      <p>Origin: ${breedData.origin}</p>
    `
  } catch(error) {
    console.error("Error in selection:", error);
  }
}
breedSelect.addEventListener('change', handleBreedSelection);


/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */

//------------------- REFACTOR CODE FROM FETCH TO AXIOS --------------------- 
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

axios.get((baseURL + "/v1/breeds"), { header })
  .then(response => {
    // Handle response
    // console.log(response.data);
  })
  .catch(error => {
    // Handle error
    console.error('Error fetching data:', error);
  });


/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
