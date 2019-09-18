const awsmobile = {
    // aws_project_region: 'us-west-2',
    // // "aws_cognito_identity_pool_id": "ap-southeast-1:5ab8555d-581e-47a2-bbda-6c2cd7b3a862",
    // aws_cognito_region: 'us-west-2',
    // aws_user_pools_id: 'us-west-2_flCJaoDig',
    // aws_user_pools_web_client_id: '159ufjrihgehb67sn373aotli7',
    aws_project_region: 'us-east-1',
    // "aws_cognito_identity_pool_id": "ap-southeast-1:5ab8555d-581e-47a2-bbda-6c2cd7b3a862",
    aws_cognito_region: 'us-east-1',
    aws_user_pools_id: 'us-east-1_BCo9K7F0w',
    aws_user_pools_web_client_id: '2m6onkgqo2br4butbth1g3j7dt',
    Auth: {
        oauth : {
            // Domain name
            domain : 'hr.auth.us-east-1.amazoncognito.com',
            // Authorized scopes
            scope: ['profile', 'openid', 'aws.cognito.signin.user.admin'],
            // Callback URL
            redirectSignIn : 'https://192.168.16.40:8080',
            // Sign out URL
            redirectSignOut : 'https://192.168.16.40:8080/login',
            // 'code' for Authorization code grant,
            // 'token' for Implicit grant
            responseType: 'code',
            // optional, for Cognito hosted ui specified options
        }
    }
};


export default awsmobile;
