[![](https://cl.ly/2c2O2411152S/colorme.png)](https://colorme.io)

# [ColorMe](https://colorme.io) [![Build Status](https://travis-ci.org/tylergaw/colorme.svg)](https://travis-ci.org/tylergaw/colorme)

**NOTE:** the CSS color function here is deprecated. New functions are in
the works. When a spec is available we’ll get this site updated.
See [this Github issue](https://github.com/w3c/csswg-drafts/issues/3187#issuecomment-499126198) for background.

Visualize The CSS [Color Function]((https://drafts.csswg.org/css-color/#modifying-colors)).

## Contributing

ColorMe.io is built using [Create React App](https://github.com/facebookincubator/create-react-app). See that project for detailed documentation.

### Running the project locally

```
npm install
```

Start site in development mode

```
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in a browser.

### Pull requests always welcome

If you find a bug or have an idea, feel free to open a pull request. Tests for new code are encouraged. Existing tests must pass before pull requests will be accepted

```
npm test
```

Tests will also run in [Travis](https://travis-ci.org/tylergaw/colorme).

## Building
```
npm run build
```

Will run a modified version of CRA build process. First it builds the project for production like normal. Once that completes it runs `npm run generate-sw` which executes `scripts/generate-sw.js`. That script locates the static assets in `build/asset-manifest.js` and writes them to the `STATIC_URLS` in `build/service-worker.js`. This allows us to cache the static assets with fingerprinted filenames.

## Releasing

This section is for you, Tyler. When you go away from this project for a while and come back you will no doubt forget how to deploy to prod.

This site is hosted in AWS S3. It uses Route53 for DNS and a Cloudfront distribution. The SSL cert is managed using AWS Certificate Manager.

To push code to prod, run:

```
npm run release
```

That will create a new git tag. Travis will see the new tag and run `./scripts/deploy.sh` which in turn builds the project with `npm run build` and uploads the artifacts to S3 using the `aws` cli tool.

Note: The AWS key and secret in `.travis.yml` are for an IAM role that only has access to the the `s3://colorme.io` bucket.
