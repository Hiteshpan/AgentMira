## URL :- https://agent-mira-client.vercel.app/ 

## Approach

- Loaded three separate JSON files on the backend.
- Merged them using a common `id` to create a unified property object.
- Built REST APIs using Node.js to:
  - Fetch merged properties
  - Filter properties based on user input (budget, location, bedrooms)
  - Save selected properties to MongoDB
- Developed a chatbot-style UI in React that:
  - Accepts user preferences
  - Communicates with backend APIs
  - Displays matching properties dynamically
- Deployed both frontend and backend on a cloud platform (Vercel).


## Challenges Faced

- Understanding and correctly merging multiple JSON data sources.
- Implementing dynamic filtering logic for partial user inputs in saved properties page.
- Managing React state within a conversational chatbot interface.
- Integrating MongoDB and preventing duplicate saved properties.
- Resolving CORS issues and environment variable configuration during deployment.


## Bonus Feature Challenges

- Structuring AI prompts and handling asynchronous API calls for NLP integration.
- Managing multiple property selections for comparison.
- Implementing real-time search without impacting performance.
