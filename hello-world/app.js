/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'local',
    endpoint: 'http://dynamo:8000'
});
const docClient = new AWS.DynamoDB.DocumentClient({region: 'local', endpoint: `http://dynamo:8000`, apiVersion: '2012-08-10' });

const response = (statusCode, body, additionalHeaders) =>  ({
    statusCode,
    body: JSON.stringify(body),
    isBase64Encoded: false,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...additionalHeaders
    },
})

function createMessage(id) {
    const params = {
        TableName: 'Message',
        Item: {
            'id': id,
            'message':  `Hello id ${id} from lambda`
        },
    }
    try {
        return docClient.put(params);
    } catch(err) {
        return err;
    }
}

exports.lambdaHandler = async (event, context) => {
    try {
        const id = parseInt((Math.random() * 1000).toString());
        let data = await createMessage(id).promise();
        return response(200, {message: `successfully added message item with id ${id}`});
    } catch (err) {
        return response(400, { message: err.message });
    }
};

