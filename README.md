# End To End Testing

This sample service service runs end to end Postman scripts using the [Postman Newman](https://github.com/postmanlabs/newman)
script runner.

You can create scripts by importing the postman json into your Postman GUI and editing them.

Make sure to setup an environment with the environment variables listed in the `serverless/runner.js` file.

## Command Line Run

You can run the job locally without serverless being involved and with the output piped to STDOUT.

```
SNS_ENDPOINT='arn:some_sns_arn' \
API_KEY='some_api_key' \
API_URL='dev-api.chain.io' \
SAMPLE_UUID: 'an-existing-node-uuid' \
node index.js
```


