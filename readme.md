# G45-REACT

This is a package to bundle react routes into an app.  
Remove a lot of boilerplate and enable code reusability.  
Easy to start your project and create a single page app with server side functionality.  

`npm install g45-react`  
or  
`npm install https://github.com/g45t345rt/g45-react/package`  

## Setup project

Your app must return an array of react-router routes.  
That's sit, the rest is handled for you.  
Check the Demo project in `/test` folder.  

## Bundler

`node ./node_modules/g45-react/bundler.js --type cf_worker --entry ./src/routes.js`

The bundler can build from 3 variants.  

- `index` (simple index.html app with no SSR).
- `node_server` (create node SSR app using express).
- `cf_worker` (create SSR app for Cloudflare Workers).

The bundler will output in `./dist` folder.  

## Lang

Add translation to your app.  
The script will check all files in `./src` and create a language dictionary that can be imported with `useLang` hook.  

`node ./node_modules/g45-react/lang-dict.js --src ./src --outfile ./lang/en.json`

## Other

### Public folder

Create a `/public` folder will be copied in the `/dist` folder.

### Use hooks

Check `/hooks` for helpers that gives you control on server request and data.

### Use components

Check `/components` for generic components that can be useful for any project.
