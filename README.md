[![](https://cl.ly/2W3w2y0B1y2Z/post-image-colorme-screenshot-1.png)](https://colorme.io)

# [ColorMe](https://colorme.io) [![Build Status](https://travis-ci.org/tylergaw/colorme.svg)](https://travis-ci.org/tylergaw/colorme)

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

## Releasing

This section is for you, Tyler. When you go away from this project for a while and come back you will no doubt forget how to deploy to prod.

This site is hosted in AWS S3. It uses Route53 for DNS and a Cloudfront distribution. The SSL cert is managed using AWS Certificate Manager.

To push code to prod, run:

```
npm run release
```

That will create a new git tag. Travis will see the new tag and run `./scripts/deploy.sh` which in turn builds the project and uploads the artifacts to S3 using the `aws` cli tool.

Note: The AWS key and secret in `.travis.yml` are for an IAM role that only has access to the the `s3://colorme.io` bucket.
