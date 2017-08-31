/* eslint no-console: 0*/
const newman = require('newman')
const AWS = require('aws-sdk')


exports.handler = (event, context, callback)  => {
  const postmanEnvironment = {
    id: 'dd0d8c22-f556-28bd-e670-b77e013a187c',
    name: 'chainioenv',
    values: [
      {
        enabled: true,
        key: 'url',
        value: process.env.API_URL,
        type: 'text'
      },
      {
        enabled: true,
        key: 'api-key',
        value: process.env.API_KEY,
        type: 'text'
      },
      {
        enabled: true,
        key: 'sample-uuid',
        value: process.env.SAMPLE_UUID,
        type: 'text'
      }
    ],
    _postman_variable_scope: 'environment'
  }
  const responseHandler = (err, summary) => {
    const env = process.env.CHAINIO_ENV
    new AWS.SNS({ apiVersion: '2010-03-31' }).publish({
      Message: JSON.stringify({
        //eslint-disable-next-line max-len
        default: `Postman Failures: Postman monitor failed to execute with the following error: ${JSON.stringify(err)}`,
        sms: `Postman monitor failed - ${env}`
      }),
      MessageStructure: 'json',
      Subject: `POSTMAN Monitor Failed - ${env}`,
      TopicArn: process.env.SNS_ENDPOINT
    })
    if (summary.run.failures.length === 0) {
      callback(null, 'Postman run successful')
    }
    else {
      console.log('Postman response:', summary)
      new AWS.SNS({ apiVersion: '2010-03-31' }).publish({
        Message: JSON.stringify({
          //eslint-disable-next-line max-len
          default: `Postman Failures: ${summary.run.failures.map(f => f.source.name)}\n\nPostman monitor failed with the following body: ${JSON.stringify(summary)}`,
          sms: `Postman monitor failed - ${env}`
        }),
        MessageStructure: 'json',
        Subject: `POSTMAN Monitor Failed - ${env}`,
        TopicArn: process.env.SNS_ENDPOINT
      }, (snsErr, result) => {
        if (snsErr) {
          console.log('SNS ERROR:', JSON.stringify(snsErr))
        }
        else {
          console.log('Failure message sent to SNS: '+process.env.SNS_ENDPOINT)
        }
        callback(null, 'Postman run failed.')
      })
    }
  }
  const newmanRequest = {
    collection: './postman/chainio_api_tests.postman.json',
    environment: postmanEnvironment
  }
  newman.run(newmanRequest, responseHandler)
}
