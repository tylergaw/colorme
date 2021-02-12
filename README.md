[![](https://cl.ly/2c2O2411152S/colorme.png)](https://colorme.io)

# [ColorMe](https://colorme.io) [![Netlify Status](https://api.netlify.com/api/v1/badges/ca96f746-a437-420e-ac37-f6d8f542b974/deploy-status)](https://app.netlify.com/sites/colorme-io/deploys)

**⚠️ NOTE:** the CSS color function used for this originally is deprecated. As of 2020-10 new color modification specs are available. See [issues/18](https://github.com/tylergaw/colorme/issues/18).

## Contributing

ColorMe.io is built using [Create React App](https://github.com/facebookincubator/create-react-app).

- Production: [https://colorme.io](https://colorme.io)
- Netlify URL: [https://colorme-io.netlify.app](https://colorme-io.netlify.app)
- Staging: Every pull request gets a preview deploy URL. Check the PR or Netlify for it.

### Running the project locally

```
yarn
```

Start site in development mode

```
yarn start
```

Open [http://localhost:3000](http://localhost:3000) to view it in a browser.

### Pull requests always welcome

If you find a bug or have an idea, feel free to open a pull request. Tests for new code are encouraged. Existing tests must pass before pull requests will be accepted`

```
yarn test
```

## Building

```
yarn build
```

Runs a modified version of CRA build process.

- First it builds the project for production like normal.
- Once that completes it runs `yarn generate-sw` which executes `scripts/generate-sw.js`.
- That script locates the static assets in `build/asset-manifest.js` and writes them to the `STATIC_URLS` in `build/service-worker.js`. This allows us to cache the static assets with fingerprinted filenames.

## Deploying

### To Production

We host this site on [Netlify](https://www.netlify.com/). Anything merged into the `main` branch is deployed to production.

### To Staging

We use Netlify preview builds. To see any branch in a live environment, push the branch to the remote and open a pull request.
